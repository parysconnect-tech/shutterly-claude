import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { courses, totalLessons, flatLessons, challenges } from '@/content/curriculum';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Sparkles, Flame, Trophy, Camera, ArrowRight, BookOpen, Image as ImageIcon } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/signin?callbackUrl=/dashboard');
  const t = await getTranslations();
  const locale = (await getLocale()) as 'en' | 'af';
  const userId = (session.user as any).id as string;

  // Pull progress (gracefully handle missing tables in fresh installs)
  const [progressRows, submissions, badgeAwards] = await Promise.all([
    prisma.lessonProgress.findMany({ where: { userId }, orderBy: { lastViewedAt: 'desc' } }).catch(() => []),
    prisma.challengeSubmission.count({ where: { userId } }).catch(() => 0),
    prisma.badgeAward.count({ where: { userId } }).catch(() => 0)
  ]);

  const course = courses[0];
  const lessons = flatLessons(course.slug);
  const completed = progressRows.filter((p) => p.status === 'completed').length;
  const total = totalLessons(course.slug);
  const pct = Math.round((completed / Math.max(1, total)) * 100);

  // Continue learning = most recent in-progress, else first lesson
  const lastViewed = progressRows[0];
  const continueLink = lastViewed
    ? `/learn/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}` // simplified for stub
    : `/learn/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}`;

  const recommended = lessons[Math.min(completed, lessons.length - 1)];
  const weekly = challenges[0];

  return (
    <div className="container-wide max-w-6xl space-y-8 mx-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-fg">{t('dashboard.welcome')},</p>
          <h1 className="heading-display text-3xl sm:text-4xl">
            {session.user.name?.split(' ')[0] ?? 'Photographer'}.
          </h1>
        </div>
        <Badge tone="brand"><Sparkles className="h-3 w-3" /> {pct}% of course done</Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label={t('dashboard.stats.lessonsDone')} value={`${completed}/${total}`} />
        <StatCard icon={Flame} label={t('dashboard.stats.streak')} value="3" />
        <StatCard icon={Trophy} label={t('dashboard.stats.badges')} value={String(badgeAwards)} />
        <StatCard icon={Camera} label={t('dashboard.stats.challenges')} value={String(submissions)} />
      </div>

      {/* Continue + recommended */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="relative h-40 bg-gradient-to-r from-brand-400 to-brand-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="relative z-10 p-6 text-white">
              <p className="text-xs uppercase tracking-wider opacity-80">{t('dashboard.continueLearning')}</p>
              <h2 className="heading-display mt-1 text-2xl">{course.title[locale]}</h2>
            </div>
          </div>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <Progress value={pct} />
              <Button asChild>
                <Link href={continueLink}>
                  {t('common.continue')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {recommended && (
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-fg">{t('dashboard.recommended')}</p>
                  <p className="heading-display mt-1 text-lg leading-tight">
                    {recommended.lesson.title[locale]}
                  </p>
                  <p className="mt-1 text-sm text-muted-fg line-clamp-2">{recommended.lesson.summary[locale]}</p>
                  <Link
                    href={`/learn/${course.slug}/${recommended.module.slug}/${recommended.lesson.slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                  >
                    Start <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-fg">{t('dashboard.recentLessons')}</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {progressRows.slice(0, 3).length ? (
                    progressRows.slice(0, 3).map((p) => (
                      <li key={p.id} className="flex justify-between">
                        <span className="line-clamp-1">Lesson {p.lessonId.slice(0, 6)}…</span>
                        <span className="text-muted-fg">{p.percent}%</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-fg">{t('dashboard.empty')}</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly challenge */}
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge tone="accent" className="mb-2">{t('dashboard.weeklyChallenge')}</Badge>
            <CardTitle>{weekly.title[locale]}</CardTitle>
            <CardDescription>{weekly.brief[locale]}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="secondary">
              <Link href={`/challenges/${weekly.slug}`}>{t('challenges.viewBrief')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modules grid */}
      <div>
        <h2 className="heading-display text-2xl mb-4">Modules in {course.title[locale]}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {course.modules.map((m, i) => (
            <Link
              key={m.slug}
              href={`/learn/${course.slug}/${m.slug}/${m.lessons[0].slug}`}
              className="group rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <Badge tone="brand">{String(i + 1).padStart(2, '0')}</Badge>
              <p className="heading-display mt-2 text-base">{m.title[locale]}</p>
              <p className="mt-1 text-xs text-muted-fg line-clamp-2">{m.summary[locale]}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent uploads placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.uploads')}</CardTitle>
          <CardDescription>{t('dashboard.empty')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/challenges"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-fg hover:bg-muted"
          >
            <ImageIcon className="h-4 w-4" /> Submit your first challenge frame
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value
}: {
  icon: any;
  label: string;
  value: string;
}) {
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
