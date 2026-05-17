import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    return NextResponse.json({ ok: true, message: 'Database reachable.' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'DB unreachable.' }, { status: 500 });
  }
}
