// PATCH  /api/admin/users/[id]   { name?, role?, password? }
// DELETE /api/admin/users/[id]

import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN', 'SUPERADMIN']).optional(),
  password: z.string().min(8).max(200).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // Promoting to SUPERADMIN requires SUPERADMIN
  if (parsed.data.role === 'SUPERADMIN' && guard.user.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Only superadmins can promote to superadmin' }, { status: 403 });
  }

  // Prevent demoting yourself out of admin (foot-gun guard)
  if (params.id === guard.user.id && parsed.data.role && parsed.data.role !== guard.user.role) {
    return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 });
  }

  const data: any = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.role !== undefined) data.role = parsed.data.role;
  if (parsed.data.password !== undefined) data.passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, email: true, name: true, role: true },
    });
    return NextResponse.json({ ok: true, user: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  // Don't let admins delete themselves
  if (params.id === guard.user.id) {
    return NextResponse.json({ error: 'You cannot delete your own account here' }, { status: 400 });
  }

  // Only SUPERADMIN can delete an ADMIN or SUPERADMIN
  const target = await prisma.user.findUnique({ where: { id: params.id }, select: { role: true } });
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if ((target.role === 'ADMIN' || target.role === 'SUPERADMIN') && guard.user.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Only superadmins can delete admins' }, { status: 403 });
  }

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Delete failed' }, { status: 500 });
  }
}
