'use client';

// Floating launcher visible only to ADMIN / SUPERADMIN.
// Sits bottom-right and opens the /admin shell.
// Hidden on /admin pages (you're already there) and on /signin etc.

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'shutterly-superadmin-launcher-hidden';

export function SuperadminLauncher() {
  const pathname = usePathname() || '';
  const { data: session, status } = useSession();
  const [hidden, setHidden] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Persist user's "hide for this session" preference
  React.useEffect(() => {
    setMounted(true);
    try {
      setHidden(sessionStorage.getItem(STORAGE_KEY) === '1');
    } catch {}
  }, []);

  if (!mounted) return null;
  if (status !== 'authenticated') return null;

  const role = (session?.user as any)?.role;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') return null;

  // Don't show on admin pages or auth pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    return null;
  }

  if (hidden) {
    return (
      <button
        onClick={() => {
          setHidden(false);
          try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
        }}
        aria-label="Show admin launcher"
        className="fixed bottom-4 right-4 z-50 h-8 w-8 rounded-full bg-foreground/10 text-foreground/40 backdrop-blur hover:bg-foreground/20 hover:text-foreground transition-colors"
      >
        <Shield className="m-auto h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full',
        'border border-border bg-background/95 p-1 pl-1 shadow-lg ring-1 ring-black/5 backdrop-blur',
        'animate-in fade-in slide-in-from-bottom-2 duration-300'
      )}
    >
      <Link
        href="/admin"
        className={cn(
          'group inline-flex items-center gap-2 rounded-full',
          'bg-gradient-to-br from-brand-500 to-brand-600 px-3.5 py-2 text-xs font-medium text-white',
          'hover:from-brand-600 hover:to-brand-700 transition-all',
          'shadow-sm hover:shadow-md'
        )}
      >
        <Shield className="h-3.5 w-3.5" />
        <span>Admin</span>
        {role === 'SUPERADMIN' && (
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">
            super
          </span>
        )}
      </Link>
      <button
        onClick={() => {
          setHidden(true);
          try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
        }}
        aria-label="Hide admin launcher"
        title="Hide (until next visit)"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-fg hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
