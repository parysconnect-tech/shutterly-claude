import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { MessagesInbox } from '@/components/admin/MessagesInbox';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user) redirect('/signin?callbackUrl=/admin/messages');
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') redirect('/dashboard');

  const [messages, unreadCount, archivedCount] = await Promise.all([
    prisma.contactSubmission.findMany({
      where: { archived: false },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }).catch(() => []),
    prisma.contactSubmission.count({ where: { read: false, archived: false } }).catch(() => 0),
    prisma.contactSubmission.count({ where: { archived: true } }).catch(() => 0),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="heading-display text-3xl sm:text-4xl">Messages</h1>
        <p className="mt-2 text-muted-fg">
          Every contact form submission lands here. Reply by email — click the address.
        </p>
      </header>

      <MessagesInbox
        initial={messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
        unreadCount={unreadCount}
        archivedCount={archivedCount}
      />
    </div>
  );
}
