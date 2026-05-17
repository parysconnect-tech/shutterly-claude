import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

// Stub: store a verification token. Wire to your SMTP/Resend provider in lib/email.ts.
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ ok: true });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true }); // do not leak

  const token = crypto.randomBytes(24).toString('hex');
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60)
    }
  });

  // TODO: send email with link: `${process.env.NEXTAUTH_URL}/reset?token=${token}`
  console.info('[shutterly] password reset token:', token);
  return NextResponse.json({ ok: true });
}
