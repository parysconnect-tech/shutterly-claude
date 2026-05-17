import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  courseSlug: z.string(),
  moduleSlug: z.string(),
  lessonSlug: z.string(),
  status: z.enum(['in_progress', 'completed']),
  percent: z.number().int().min(0).max(100)
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  // Find the lesson (or create a stub if the DB hasn't been seeded yet)
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: parsed.data.lessonSlug,
      module: { slug: parsed.data.moduleSlug, course: { slug: parsed.data.courseSlug } }
    }
  });
  if (!lesson) return NextResponse.json({ error: 'Lesson not found — run db seed first.' }, { status: 404 });

  const userId = (session.user as any).id as string;
  const completed = parsed.data.status === 'completed';
  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: lesson.id } },
    update: {
      status: parsed.data.status,
      percent: parsed.data.percent,
      lastViewedAt: new Date(),
      ...(completed ? { completedAt: new Date() } : {})
    },
    create: {
      userId,
      lessonId: lesson.id,
      status: parsed.data.status,
      percent: parsed.data.percent,
      ...(completed ? { completedAt: new Date() } : {})
    }
  });
  return NextResponse.json({ ok: true, progress });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const rows = await prisma.lessonProgress.findMany({
    where: { userId },
    orderBy: { lastViewedAt: 'desc' }
  });
  return NextResponse.json({ progress: rows });
}
