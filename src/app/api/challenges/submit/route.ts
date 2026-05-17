import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  challengeSlug: z.string(),
  mediaId: z.string(),
  caption: z.string().max(500).optional()
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const challenge = await prisma.challenge.findUnique({ where: { slug: parsed.data.challengeSlug } });
  if (!challenge) return NextResponse.json({ error: 'Unknown challenge' }, { status: 404 });

  const sub = await prisma.challengeSubmission.create({
    data: {
      challengeId: challenge.id,
      userId: (session.user as any).id as string,
      mediaId: parsed.data.mediaId,
      caption: parsed.data.caption
    }
  });

  return NextResponse.json({ ok: true, submission: sub });
}
