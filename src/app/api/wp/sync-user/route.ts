import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

// Endpoint that the WordPress bridge plugin calls after a WP user logs in.
// Creates or updates a matching Shutterly user, returns the Shutterly user id.

const schema = z.object({
  wpUserId: z.number().int(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['subscriber', 'author', 'editor', 'administrator']).optional()
});

export async function POST(req: Request) {
  const sharedSecret = process.env.WP_SHARED_SECRET;
  if (!sharedSecret) {
    return NextResponse.json({ error: 'WP integration not configured.' }, { status: 503 });
  }
  if (req.headers.get('x-shutterly-key') !== sharedSecret) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const mappedRole =
    parsed.data.role === 'administrator' ? 'ADMIN' :
    parsed.data.role === 'editor' ? 'INSTRUCTOR' :
    'STUDENT';

  const user = await prisma.user.upsert({
    where: { email: parsed.data.email },
    update: {
      wpUserId: parsed.data.wpUserId,
      name: parsed.data.name ?? undefined,
      role: mappedRole as any
    },
    create: {
      email: parsed.data.email,
      name: parsed.data.name,
      wpUserId: parsed.data.wpUserId,
      role: mappedRole as any,
      // random unusable password — WP is the identity provider
      passwordHash: await bcrypt.hash(`wp-${Date.now()}-${Math.random()}`, 10)
    }
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
