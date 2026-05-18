// One-shot bootstrap route to create the SUPERADMIN account for Elmar.
// Safe to call repeatedly — idempotent.
//
// Visit /api/admin/seed-me once after deploying to create:
//   email:    elmar@elkie.co.za
//   password: Heaven@1stAve
//   role:     SUPERADMIN
//
// If the user already exists with a different role, it is promoted to SUPERADMIN.

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

const ADMIN_EMAIL = 'elmar@elkie.co.za';
const ADMIN_PASSWORD = 'Heaven@1stAve';
const ADMIN_NAME = 'Elmar';

async function ensureAdmin() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    if (existing.role !== 'SUPERADMIN') {
      await prisma.user.update({
        where: { email: ADMIN_EMAIL },
        data: { role: 'SUPERADMIN' },
      });
      return { status: 'role_promoted', email: ADMIN_EMAIL, role: 'SUPERADMIN' };
    }
    return { status: 'already_exists', email: ADMIN_EMAIL, role: 'SUPERADMIN' };
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      passwordHash,
      role: 'SUPERADMIN',
      emailVerified: new Date(),
    },
  });

  return { status: 'created', email: ADMIN_EMAIL, role: 'SUPERADMIN' };
}

export async function POST() {
  try {
    const result = await ensureAdmin();
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { status: 'error', message: e?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}

// Allow GET so the user can simply paste the URL into a browser.
export async function GET() {
  return POST();
}
