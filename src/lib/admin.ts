// Tiny helpers for admin-gated API routes.
// Returns { ok: true, user } when allowed; { ok: false, response } when blocked.

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPERADMIN';

type Guard =
  | { ok: true; user: { id: string; email?: string | null; role: Role } }
  | { ok: false; response: NextResponse };

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  const u = session?.user as any;
  if (!u?.id) return null;
  return { id: u.id as string, email: u.email as string | undefined, role: (u.role || 'STUDENT') as Role };
}

export async function requireAdmin(): Promise<Guard> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: 'Not signed in' }, { status: 401 }) };
  }
  if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
    return { ok: false, response: NextResponse.json({ error: 'Admin only' }, { status: 403 }) };
  }
  return { ok: true, user };
}

export async function requireSuperadmin(): Promise<Guard> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: 'Not signed in' }, { status: 401 }) };
  }
  if (user.role !== 'SUPERADMIN') {
    return { ok: false, response: NextResponse.json({ error: 'Superadmin only' }, { status: 403 }) };
  }
  return { ok: true, user };
}
