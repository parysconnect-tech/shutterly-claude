'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, GraduationCap, Trophy, Images, User, Settings, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StudentSidebar() {
  const t = useTranslations();
  const pathname = usePathname();
  const items = [
    { href: '/dashboard', icon: Home, label: t('nav.dashboard') },
    { href: '/learn', icon: GraduationCap, label: t('nav.courses') },
    { href: '/challenges', icon: Trophy, label: t('nav.challenges') },
    { href: '/gallery', icon: Images, label: t('nav.gallery') },
    { href: '/discover', icon: Compass, label: 'Discover' },
    { href: '/profile', icon: User, label: t('nav.profile') },
    { href: '/settings', icon: Settings, label: t('nav.settings') }
  ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-border bg-background/60 backdrop-blur md:block">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                active
                  ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
                  : 'text-muted-fg hover:bg-muted hover:text-foreground'
              )}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
