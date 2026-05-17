import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== 'ADMIN' && role !== 'SUPERADMIN')) {
    return NextResponse.json({ error: 'Admin only.' }, { status: 403 });
  }
  const userId = (session.user as any).id as string;
  const body = await req.json().catch(() => ({}));

  if (body.dismiss) {
    await prisma.adminWizardState.upsert({
      where: { userId },
      update: { dismissedAt: new Date() },
      create: { userId, dismissedAt: new Date() }
    });
    return NextResponse.json({ ok: true });
  }

  const next = await prisma.adminWizardState.upsert({
    where: { userId },
    update: {
      currentStep: Number(body.currentStep ?? 0),
      payload: JSON.stringify(body.payload ?? {}),
      completed: !!body.completed
    },
    create: {
      userId,
      currentStep: Number(body.currentStep ?? 0),
      payload: JSON.stringify(body.payload ?? {}),
      completed: !!body.completed
    }
  });

  return NextResponse.json({ ok: true, state: next });
}
