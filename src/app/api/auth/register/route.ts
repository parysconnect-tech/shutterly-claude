import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(120),
  agree: z.boolean().refine((v) => v === true, 'Must accept terms')
});

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: 'An account with that email exists.' }, { status: 409 });
  }
  const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.toLowerCase();
  const isBootstrapAdmin = bootstrapEmail === parsed.data.email.toLowerCase();
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      role: isBootstrapAdmin ? 'SUPERADMIN' : 'STUDENT'
    }
  });
  // Auto-enrol in the first course
  const firstCourse = await prisma.course.findFirst({ orderBy: { sortOrder: 'asc' } });
  if (firstCourse) {
    await prisma.enrolment.create({
      data: { userId: user.id, courseId: firstCourse.id }
    }).catch(() => null);
  }
  return NextResponse.json({ ok: true });
}
