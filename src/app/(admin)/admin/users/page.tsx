import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { UsersManager } from '@/components/admin/UsersManager';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user) redirect('/signin?callbackUrl=/admin/users');
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') redirect('/dashboard');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      country: true,
      locale: true,
      createdAt: true,
      _count: { select: { enrolments: true, submissions: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
  }).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="heading-display text-3xl sm:text-4xl">Users &amp; roles</h1>
        <p className="mt-2 text-muted-fg">
          Everyone with a Shutterly account. Promote, demote, reset passwords, or create
          new accounts by hand.
        </p>
      </header>

      <UsersManager
        currentUserId={(session.user as any).id}
        currentUserRole={role}
        initial={users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
