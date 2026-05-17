import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  const [courses, lessons] = await Promise.all([
    prisma.course.count().catch(() => 0),
    prisma.lesson.count().catch(() => 0)
  ]);
  if (courses > 0 && lessons > 0) {
    return NextResponse.json({ ok: true, message: `${courses} course(s), ${lessons} lesson(s) seeded.` });
  }
  return NextResponse.json({ ok: false, error: 'Run npm run db:seed to load the curriculum.' }, { status: 400 });
}
