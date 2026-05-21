// POST /api/track { path }
// Records a page view with a privacy-friendly visitor hash (IP+UA → SHA-256).
// No cookies, no PII stored. Used for /admin/stats.

import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const DAILY_SALT_ENV = process.env.NEXTAUTH_SECRET || 'shutterly-default-salt';

function hashVisitor(ip: string, ua: string) {
  // Rotates daily so visitorId is non-stable beyond 24h. Cheap pseudo-uniqueness.
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${day}|${ip}|${ua}|${DAILY_SALT_ENV}`).digest('hex').slice(0, 24);
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof body?.path === 'string' ? body.path.slice(0, 500) : null;
  if (!path) return NextResponse.json({ ok: false }, { status: 400 });

  // Skip noise paths
  if (path.startsWith('/api/') || path.startsWith('/_next/')) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id ?? null;

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  const country = req.headers.get('x-vercel-ip-country') || null;
  const referer = req.headers.get('referer') || null;

  try {
    await prisma.pageView.create({
      data: {
        path,
        referer,
        country,
        userId,
        visitorId: hashVisitor(ip, ua),
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Don't block the page if tracking fails
    return NextResponse.json({ ok: false });
  }
}
