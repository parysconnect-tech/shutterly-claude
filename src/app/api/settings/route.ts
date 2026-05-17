import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const settings = await prisma.siteSetting.findMany().catch(() => []);
  const map: Record<string, any> = {};
  for (const s of settings) {
    try { map[s.key] = JSON.parse(s.value); } catch { map[s.key] = s.value; }
  }
  return NextResponse.json({ settings: map });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== 'ADMIN' && role !== 'SUPERADMIN')) {
    return NextResponse.json({ error: 'Admin only.' }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  for (const [key, value] of Object.entries(body)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    });
  }
  return NextResponse.json({ ok: true });
}
