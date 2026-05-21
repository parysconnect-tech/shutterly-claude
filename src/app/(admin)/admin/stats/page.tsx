import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Eye, Users, BookOpen, Trophy, Mail, TrendingUp, Globe } from 'lucide-react';
import { ViewsChart } from '@/components/admin/ViewsChart';

export const dynamic = 'force-dynamic';

function daysAgo(n: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export default async function StatsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user) redirect('/signin?callbackUrl=/admin/stats');
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') redirect('/dashboard');

  const since30 = daysAgo(30);
  const since7 = daysAgo(7);
  const since1 = daysAgo(1);

  const [
    totalUsers,
    totalCourses,
    totalChallenges,
    totalSubmissions,
    totalMessages,
    unreadMessages,
    views30,
    views7,
    views1,
    uniqueVisitors30,
    topPages,
    topCountries,
    rawDaily,
    signups30,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.course.count().catch(() => 0),
    prisma.challenge.count().catch(() => 0),
    prisma.challengeSubmission.count().catch(() => 0),
    prisma.contactSubmission.count().catch(() => 0),
    prisma.contactSubmission.count({ where: { read: false, archived: false } }).catch(() => 0),
    prisma.pageView.count({ where: { createdAt: { gte: since30 } } }).catch(() => 0),
    prisma.pageView.count({ where: { createdAt: { gte: since7 } } }).catch(() => 0),
    prisma.pageView.count({ where: { createdAt: { gte: since1 } } }).catch(() => 0),
    prisma.pageView
      .findMany({
        where: { createdAt: { gte: since30 } },
        select: { visitorId: true },
        distinct: ['visitorId'],
      })
      .then((r) => r.length)
      .catch(() => 0),
    prisma.pageView
      .groupBy({
        by: ['path'],
        where: { createdAt: { gte: since30 } },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      })
      .catch(() => []),
    prisma.pageView
      .groupBy({
        by: ['country'],
        where: { createdAt: { gte: since30 }, country: { not: null } },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 8,
      })
      .catch(() => []),
    prisma.pageView
      .findMany({
        where: { createdAt: { gte: since30 } },
        select: { createdAt: true, visitorId: true },
      })
      .catch(() => []),
    prisma.user.count({ where: { createdAt: { gte: since30 } } }).catch(() => 0),
    prisma.user
      .findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      })
      .catch(() => []),
  ]);

  // Bucket views by day
  const byDay = new Map<string, { views: number; uniques: Set<string> }>();
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    byDay.set(key, { views: 0, uniques: new Set() });
  }
  rawDaily.forEach((v) => {
    const key = v.createdAt.toISOString().slice(0, 10);
    const entry = byDay.get(key);
    if (entry) {
      entry.views++;
      entry.uniques.add(v.visitorId);
    }
  });
  const daily = Array.from(byDay.entries()).map(([date, { views, uniques }]) => ({
    date,
    views,
    uniques: uniques.size,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="heading-display text-3xl sm:text-4xl">Stats &amp; page views</h1>
        <p className="mt-2 text-muted-fg">A 30-day snapshot of how Shutterly is doing.</p>
      </header>

      {/* KPI grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Eye} label="Page views · 30d" value={views30} sub={`${views7} this week · ${views1} today`} tone="brand" />
        <Kpi icon={TrendingUp} label="Unique visitors · 30d" value={uniqueVisitors30} sub="By daily-rotating hash" tone="accent" />
        <Kpi icon={Users} label="Total users" value={totalUsers} sub={`${signups30} joined in 30d`} tone="success" />
        <Kpi icon={Mail} label="Messages" value={totalMessages} sub={`${unreadMessages} unread`} tone={unreadMessages > 0 ? 'warning' : 'default'} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi icon={BookOpen} label="Courses" value={totalCourses} />
        <Kpi icon={Trophy} label="Challenges" value={totalChallenges} />
        <Kpi icon={Trophy} label="Submissions" value={totalSubmissions} />
      </div>

      {/* Views chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily traffic</CardTitle>
          <CardDescription>Page views and unique visitors, last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {views30 === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-fg">
              No views yet. Once the tracking deploy is live and someone visits a page, this fills up.
            </div>
          ) : (
            <ViewsChart data={daily} />
          )}
        </CardContent>
      </Card>

      {/* Top pages + countries */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top pages · 30d</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? (
              <p className="text-sm text-muted-fg">No data yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {topPages.map((p, i) => {
                  const max = topPages[0]._count.path;
                  const pct = Math.round((p._count.path / max) * 100);
                  return (
                    <li key={p.path} className="group">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate font-mono text-xs">{p.path}</span>
                        <span className="shrink-0 tabular-nums text-muted-fg">{p._count.path}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" /> Top countries · 30d</CardTitle>
          </CardHeader>
          <CardContent>
            {topCountries.length === 0 ? (
              <p className="text-sm text-muted-fg">No data yet.</p>
            ) : (
              <ul className="space-y-2">
                {topCountries.map((c) => (
                  <li key={c.country ?? 'unknown'} className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-xl leading-none">{flagFor(c.country)}</span>
                      <span>{c.country || 'Unknown'}</span>
                    </span>
                    <span className="tabular-nums text-muted-fg">{c._count.country}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent signups */}
      <Card>
        <CardHeader>
          <CardTitle>Recent signups</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSignups.length === 0 ? (
            <p className="text-sm text-muted-fg">No signups yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentSignups.map((u) => (
                <li key={u.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{u.name || u.email}</p>
                    <p className="truncate text-xs text-muted-fg">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge tone="default">{u.role}</Badge>
                    <span className="text-muted-fg">
                      {u.createdAt.toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                    </span>
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

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  sub?: string;
  tone?: 'default' | 'brand' | 'accent' | 'success' | 'warning';
}) {
  const tones: Record<string, string> = {
    default: 'text-muted-fg',
    brand: 'text-brand-500',
    accent: 'text-accent-500',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
  };
  return (
    <Card>
      <CardContent className="py-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg">{label}</p>
            <p className="heading-display mt-1 text-3xl tabular-nums">{value.toLocaleString()}</p>
            {sub && <p className="mt-1 text-xs text-muted-fg">{sub}</p>}
          </div>
          <Icon className={`h-5 w-5 ${tones[tone]}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function flagFor(country: string | null | undefined) {
  if (!country || country.length !== 2) return '🌍';
  const base = 127397;
  return String.fromCodePoint(...country.toUpperCase().split('').map((c) => base + c.charCodeAt(0)));
}
