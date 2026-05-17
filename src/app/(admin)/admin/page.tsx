import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { wizardSteps } from '@/content/wizard-steps';
import { ArrowRight, Users, BookOpen, Trophy, Sparkles } from 'lucide-react';

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user) redirect('/signin?callbackUrl=/admin');
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') redirect('/dashboard');

  const userId = (session.user as any).id as string;
  const [wizard, userCount, courseCount, challengeCount] = await Promise.all([
    prisma.adminWizardState.findUnique({ where: { userId } }).catch(() => null),
    prisma.user.count().catch(() => 0),
    prisma.course.count().catch(() => 0),
    prisma.challenge.count().catch(() => 0)
  ]);

  const pct = Math.round(((wizard?.currentStep ?? 0) / wizardSteps.length) * 100);
  const wizardDone = wizard?.completed;

  return (
    <div className="container-wide max-w-5xl mx-0 space-y-6">
      <h1 className="heading-display text-3xl">Welcome, admin.</h1>
      <p className="text-muted-fg">A bird's-eye view of your Shutterly install.</p>

      {!wizardDone && (
        <Card className="overflow-hidden border-brand-300 dark:border-brand-700 ring-1 ring-brand-200/60 dark:ring-brand-900/60">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge tone="brand"><Sparkles className="h-3 w-3" /> Launch wizard</Badge>
                <h2 className="heading-display mt-2 text-2xl">Finish your setup</h2>
                <p className="mt-1 text-sm text-muted-fg">
                  Step {wizard?.currentStep ?? 0} of {wizardSteps.length}. {pct}% complete.
                </p>
              </div>
              <Button asChild>
                <Link href="/admin/setup-wizard">Resume <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <Progress className="mt-4" value={pct} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-6 flex items-center justify-between">
          <div><p className="text-xs uppercase tracking-wider text-muted-fg">Students</p><p className="heading-display mt-1 text-2xl">{userCount}</p></div>
          <Users className="h-6 w-6 text-brand-500" />
        </CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center justify-between">
          <div><p className="text-xs uppercase tracking-wider text-muted-fg">Courses</p><p className="heading-display mt-1 text-2xl">{courseCount}</p></div>
          <BookOpen className="h-6 w-6 text-brand-500" />
        </CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center justify-between">
          <div><p className="text-xs uppercase tracking-wider text-muted-fg">Challenges</p><p className="heading-display mt-1 text-2xl">{challengeCount}</p></div>
          <Trophy className="h-6 w-6 text-brand-500" />
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
          <CardDescription>The pages you'll use day-to-day.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              ['/admin/setup-wizard', 'Re-open setup wizard'],
              ['/admin/courses', 'Manage courses'],
              ['/admin/challenges', 'Manage challenges'],
              ['/admin/users', 'Users & roles'],
              ['/admin/settings', 'Site settings'],
              ['/gallery', 'Public gallery']
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center justify-between rounded-xl border border-border p-3 text-sm hover:bg-muted"
                >
                  <span>{label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-fg" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
