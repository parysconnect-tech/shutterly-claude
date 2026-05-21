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
import {
  Sparkles,
  Flame,
  Trophy,
  Camera,
  ArrowRight,
  BookOpen,
  Image as ImageIcon,
  Clock,
  Award,
  Target,
  Zap,
} from 'lucide-react';

function greetingFor(hour: number) {
  if (hour < 5) return 'Burning the midnight oil';
  if (hour < 12) return 'Goeie môre';
  if (hour < 17) return 'Howzit';
  if (hour < 21) return 'Sundowner time';
  return 'Evening';
}

function computeStreak(rows: Array<{ lastViewedAt: Date }>) {
  if (rows.length === 0) return 0;
  const days = new Set(rows.map((r) => r.lastViewedAt.toISOString().slice(0, 10)));
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      // Allow today to be empty if started yesterday
      if (streak === 0) {
        d.setDate(d.getDate() - 1);
        const yKey = d.toISOString().slice(0, 10);
        if (days.has(yKey)) continue;
      }
      break;
    }
  }
  return streak;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/signin?callbackUrl=/dashboard');
  const t = await getTranslations();
  const locale = (await getLocale()) as 'en' | 'af';
  const userId = (session.user as any).id as string;

  const [progressRows, submissions, badgeAwards, recentBadges] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId },
      orderBy: { lastViewedAt: 'desc' },
    }).catch(() => []),
    prisma.challengeSubmission.count({ where: { userId } }).catch(() => 0),
    prisma.badgeAward.count({ where: { userId } }).catch(() => 0),
    prisma.badgeAward
      .findMany({
        where: { userId },
        orderBy: { awardedAt: 'desc' },
        take: 4,
        include: { badge: true },
      })
      .catch(() => []),
  ]);

  const course = courses[0];
  const lessons = flatLessons(course.slug);
  const completed = progressRows.filter((p) => p.status === 'completed').length;
  const total = totalLessons(course.slug);
  const pct = Math.round((completed / Math.max(1, total)) * 100);
  const streak = computeStreak(progressRows);

  const lastViewed = progressRows[0];
  const continueLink = lastViewed
    ? `/learn/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}`
    : `/learn/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}`;

  const recommended = lessons[Math.min(completed, lessons.length - 1)];
  const weekly = challenges[0];
  const firstName = session.user.name?.split(' ')[0] ?? 'Photographer';
  const greeting = greetingFor(new Date().getHours());
  const totalMinutesLearned = progressRows.reduce((acc, r) => acc + Math.round((r.percent / 100) * 8), 0); // estimate

  return (
    <div className="container-wide max-w-6xl space-y-8 mx-0">
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-700 p-6 sm:p-8 text-white shadow-soft">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={course.coverImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium opacity-90">{greeting},</p>
          <h1 className="heading-display mt-1 text-3xl leading-tight sm:text-5xl">{firstName}.</h1>
          <p className="mt-3 max-w-md text-sm opacity-90">
            {completed === 0
              ? 'Your camera bag is packed. Let’s take the first frame together.'
              : pct === 100
                ? 'You finished the course. Time to teach someone else.'
                : `You're ${pct}% through ${course.title[locale]} — keep the momentum.`}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button asChild size="lg" className="bg-white text-brand-700 hover:bg-white/90">
              <Link href={continueLink}>
                {completed === 0 ? 'Start your first lesson' : t('common.continue')}{' '}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {streak > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur">
                <Flame className="h-3.5 w-3.5 text-amber-200" />
                <span className="font-semibold">{streak}-day streak</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label={t('dashboard.stats.lessonsDone')} value={`${completed}/${total}`} accent="brand" />
        <StatCard icon={Flame} label={t('dashboard.stats.streak')} value={`${streak}d`} accent={streak > 0 ? 'warning' : 'muted'} />
        <StatCard icon={Trophy} label={t('dashboard.stats.badges')} value={String(badgeAwards)} accent="accent" />
        <StatCard icon={Camera} label={t('dashboard.stats.challenges')} value={String(submissions)} accent="success" />
      </div>

      {/* Continue + weekly + recent */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Continue learning */}
        <Card className="lg:col-span-2 overflow-hidden border-0 shadow-soft">
          <div className="relative h-44 bg-gradient-to-r from-brand-400 to-brand-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
              <p className="text-[10px] uppercase tracking-widest opacity-80">{t('dashboard.continueLearning')}</p>
              <h2 className="heading-display mt-1 text-2xl leading-tight">{course.title[locale]}</h2>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />~{totalMinutesLearned} min studied</span>
                <span>·</span>
                <span>{course.modules.length} modules</span>
              </div>
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Progress value={pct} className="flex-1" />
              <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-fg">{pct}%</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {recommended && (
                <RecommendedTile
                  title={recommended.lesson.title[locale]}
                  summary={recommended.lesson.summary[locale]}
                  href={`/learn/${course.slug}/${recommended.module.slug}/${recommended.lesson.slug}`}
                  duration={recommended.lesson.durationMin}
                />
              )}
              <Card className="bg-muted/30 border-0">
                <CardContent className="py-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-fg">{t('dashboard.recentLessons')}</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {progressRows.slice(0, 3).length ? (
                      progressRows.slice(0, 3).map((p) => (
                        <li key={p.id} className="flex items-center gap-2">
                          <div className="h-1.5 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-brand-500"
                              style={{ width: `${p.percent}%` }}
                            />
                          </div>
                          <span className="line-clamp-1 flex-1 text-xs">Lesson {p.lessonId.slice(0, 6)}…</span>
                          <span className="text-[10px] tabular-nums text-muted-fg">{p.percent}%</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-muted-fg">{t('dashboard.empty')}</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Weekly challenge */}
        <Card className="overflow-hidden border-accent-300/40 bg-gradient-to-br from-accent-50/60 to-transparent dark:border-accent-800/40 dark:from-accent-950/30">
          <CardHeader>
            <Badge tone="accent" className="mb-2"><Target className="h-3 w-3" /> {t('dashboard.weeklyChallenge')}</Badge>
            <CardTitle>{weekly.title[locale]}</CardTitle>
            <CardDescription className="line-clamp-3">{weekly.brief[locale]}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="secondary">
              <Link href={`/challenges/${weekly.slug}`}>{t('challenges.viewBrief')} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modules grid */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="heading-display text-2xl">Course modules</h2>
            <p className="mt-1 text-sm text-muted-fg">Tap any module to jump in.</p>
          </div>
          <Badge tone="brand"><Sparkles className="h-3 w-3" /> {pct}% complete</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {course.modules.map((m, i) => {
            const modLessons = m.lessons.length;
            const modCompleted = progressRows.filter(
              (p) => p.status === 'completed' && m.lessons.some((l) => l.slug === p.lessonId)
            ).length;
            const modPct = Math.round((modCompleted / Math.max(1, modLessons)) * 100);
            return (
              <Link
                key={m.slug}
                href={`/learn/${course.slug}/${m.slug}/${m.lessons[0].slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <Badge tone="brand">{String(i + 1).padStart(2, '0')}</Badge>
                  {modPct === 100 && <Award className="h-4 w-4 text-emerald-500" />}
                </div>
                <p className="heading-display mt-2 line-clamp-2 text-base leading-tight">{m.title[locale]}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-fg">{m.summary[locale]}</p>
                <div className="mt-3">
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
                      style={{ width: `${modPct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-fg">{modCompleted}/{modLessons} lessons</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Badges showcase */}
      {recentBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-500" /> Recent badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-4">
              {recentBadges.map((ba: any) => (
                <div
                  key={ba.id}
                  className="rounded-xl border border-border bg-gradient-to-br from-amber-50 to-transparent p-4 text-center dark:from-amber-950/30"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-sm font-semibold">{ba.badge?.name || 'Badge'}</p>
                  <p className="mt-0.5 text-[10px] text-muted-fg">
                    {new Date(ba.awardedAt).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.uploads')}</CardTitle>
          <CardDescription>{t('dashboard.empty')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/challenges"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-fg hover:bg-muted hover:text-foreground transition-colors"
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
  value,
  accent = 'muted',
}: {
  icon: any;
  label: string;
  value: string;
  accent?: 'brand' | 'accent' | 'success' | 'warning' | 'muted';
}) {
  const tones: Record<string, string> = {
    brand: 'text-brand-500 bg-brand-500/10',
    accent: 'text-accent-500 bg-accent-500/10',
    success: 'text-emerald-500 bg-emerald-500/10',
    warning: 'text-amber-500 bg-amber-500/10',
    muted: 'text-muted-fg bg-muted',
  };
  return (
    <Card>
      <CardContent className="pt-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg">{label}</p>
          <p className="heading-display mt-1 text-2xl tabular-nums">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendedTile({
  title,
  summary,
  href,
  duration,
}: {
  title: string;
  summary: string;
  href: string;
  duration: number;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-muted/30 p-4 transition hover:border-brand-300 hover:bg-muted"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wider text-muted-fg">Recommended next</p>
        <span className="text-[10px] tabular-nums text-muted-fg"><Clock className="inline h-3 w-3" /> {duration}m</span>
      </div>
      <p className="heading-display mt-1 line-clamp-1 text-lg leading-tight">{title}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-fg">{summary}</p>
      <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:underline">
        Start <ArrowRight className="h-3 w-3" />
      </p>
    </Link>
  );
}
