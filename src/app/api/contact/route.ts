// Public POST → store a contact submission.
// Admin GET → list submissions (with optional ?filter=unread|all|archived).

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

const submitSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(120),
  email: z.string().trim().email('Valid email required').max(200),
  message: z.string().trim().min(5, 'Message too short').max(5000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const userAgent = req.headers.get('user-agent') ?? null;
  const referer = req.headers.get('referer') ?? null;

  try {
    await prisma.contactSubmission.create({
      data: { ...parsed.data, userAgent, referer },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Could not save message' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const filter = url.searchParams.get('filter') ?? 'all';

  const where =
    filter === 'unread' ? { read: false, archived: false }
    : filter === 'archived' ? { archived: true }
    : { archived: false };

  const messages = await prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const unreadCount = await prisma.contactSubmission.count({
    where: { read: false, archived: false },
  });

  return NextResponse.json({ messages, unreadCount });
}
