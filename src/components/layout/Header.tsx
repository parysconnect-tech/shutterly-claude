'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/courses', label: t('nav.courses') },
    { href: '/challenges', label: t('nav.challenges') },
    { href: '/gallery', label: t('nav.gallery') }
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all',
        scrolled
          ? 'border-b border-border bg-background/85 backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="container-wide flex h-16 items-center gap-3">
        <Logo />
        <nav className="ml-8 hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-muted text-foreground'
                    : 'text-muted-fg hover:bg-muted hover:text-foreground'
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            aria-label={t('common.search')}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          >
            <Search className="h-4 w-4" />
          </Link>
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <ThemeToggle compact />
          {session ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard">{t('nav.dashboard')}</Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
                {t('nav.signout')}
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button size="sm" variant="ghost" asChild>
                <Link href="/signin">{t('nav.signin')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">{t('nav.signup')}</Link>
              </Button>
            </div>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-wide flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            <div className="flex items-center justify-between gap-3 px-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <div className="mt-2 flex gap-2 px-2">
              {session ? (
                <>
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href="/dashboard">{t('nav.dashboard')}</Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
                    {t('nav.signout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href="/signin">{t('nav.signin')}</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/signup">{t('nav.signup')}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
