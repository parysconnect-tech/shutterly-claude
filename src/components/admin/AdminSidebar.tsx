'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  ShieldCheck,
  Rocket,
  ListChecks,
  BookOpen,
  Trophy,
  Users,
  Settings,
  BarChart3,
  Inbox,
  ArrowLeft,
  LogOut,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

type NavItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeKey?: 'unreadMessages';
};

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', icon: ShieldCheck, label: 'Dashboard' },
      { href: '/admin/stats', icon: BarChart3, label: 'Stats & page views' },
      { href: '/admin/launch', icon: Rocket, label: 'Launch checklist' },
    ],
  },
  {
    title: 'People',
    items: [
      { href: '/admin/users', icon: Users, label: 'Users & roles' },
      { href: '/admin/messages', icon: Inbox, label: 'Messages', badgeKey: 'unreadMessages' },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
      { href: '/admin/challenges', icon: Trophy, label: 'Challenges' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { href: '/admin/setup-wizard', icon: ListChecks, label: 'Setup wizard' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname() || '';
  const { data: session } = useSession();
  const [counts, setCounts] = React.useState<{ unreadMessages: number }>({ unreadMessages: 0 });

  // Poll unread count every 30s + on mount
  React.useEffect(() => {
    let cancelled = false;
    const fetchCounts = async () => {
      try {
        const r = await fetch('/api/contact?filter=unread', { cache: 'no-store' });
        if (!r.ok) return;
        const data = await r.json();
        if (!cancelled) setCounts({ unreadMessages: data.unreadCount ?? 0 });
      } catch {}
    };
    fetchCounts();
    const t = setInterval(fetchCounts, 30000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const role = (session?.user as any)?.role;
  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? session?.user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-gradient-to-b from-card/40 to-card/10 md:flex md:flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <Shield className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-foreground">Admin</p>
          <p className="truncate text-[10px] text-muted-fg">{role || 'Loading…'}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((sec) => (
          <div key={sec.title} className="mb-6">
            <h4 className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-fg">
              {sec.title}
            </h4>
            <div className="space-y-0.5">
              {sec.items.map((it) => {
                const active = pathname === it.href || (it.href !== '/admin' && pathname.startsWith(it.href));
                const count = it.badgeKey ? counts[it.badgeKey] : 0;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                      active
                        ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                        : 'text-muted-fg hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <it.icon className={cn('h-4 w-4 shrink-0', active && 'text-brand-600 dark:text-brand-400')} />
                    <span className="flex-1 truncate">{it.label}</span>
                    {count > 0 && (
                      <Badge tone="brand" className="ml-auto h-5 min-w-5 justify-center px-1.5 py-0 text-[10px]">
                        {count > 99 ? '99+' : count}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted/40 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-xs font-semibold text-brand-700 dark:text-brand-300">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{session?.user?.name || 'Admin'}</p>
            <p className="truncate text-[10px] text-muted-fg">{session?.user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] text-muted-fg hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] text-muted-fg hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
