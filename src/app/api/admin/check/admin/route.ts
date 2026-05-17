import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  const count = await prisma.user.count({
    where: { role: { in: ['ADMIN', 'SUPERADMIN'] } }
  }).catch(() => 0);
  if (count > 0) return NextResponse.json({ ok: true, message: `${count} admin(s) found.` });
  return NextResponse.json({ ok: false, error: 'No admin user yet. Sign up with the bootstrap email.' }, { status: 400 });
}
