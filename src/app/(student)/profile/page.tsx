import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, Camera, BookOpen, Trophy } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/signin?callbackUrl=/profile');
  const userId = (session.user as any).id as string;

  const [user, awarded, submissions, progress] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.badgeAward.findMany({ where: { userId }, include: { badge: true } }).catch(() => []),
    prisma.challengeSubmission.count({ where: { userId } }).catch(() => 0),
    prisma.lessonProgress.count({ where: { userId, status: 'completed' } }).catch(() => 0)
  ]);

  return (
    <div className="container-wide max-w-4xl mx-0 space-y-6">
      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white text-2xl font-display">
            {(user?.name ?? user?.email ?? '?').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="heading-display text-2xl">{user?.name ?? 'You'}</h1>
            <p className="text-sm text-muted-fg">{user?.email}</p>
            <div className="mt-2 flex gap-2">
              <Badge tone="brand">{user?.role}</Badge>
              <Badge tone="default">{user?.locale?.toUpperCase()}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={BookOpen} label="Lessons" value={progress} />
        <Stat icon={Camera} label="Submissions" value={submissions} />
        <Stat icon={Trophy} label="Badges" value={awarded.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Earned by completing lessons and challenges.</CardDescription>
        </CardHeader>
        <CardContent>
          {awarded.length === 0 ? (
            <p className="text-sm text-muted-fg">No badges yet — finish your first lesson to earn one.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {awarded.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 grid place-items-center text-white">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{a.badge.name}</p>
                    <p className="text-xs text-muted-fg">{a.badge.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="pt-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-fg">{label}</p>
          <p className="heading-display mt-1 text-2xl">{value}</p>
        </div>
        <Icon className="h-6 w-6 text-brand-500" />
      </CardContent>
    </Card>
  );
}
