'use client';

// Lightweight client-side page-view ping.
// Fires once on initial load + every pathname change.
// Skips admin paths so we don't pollute stats with our own clicks.

import * as React from 'react';
import { usePathname } from 'next/navigation';

export function PageViewTracker() {
  const pathname = usePathname();
  const last = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!pathname) return;
    if (last.current === pathname) return;
    last.current = pathname;

    // Don't track admin pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

    const send = () => {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    };

    // Defer slightly so it doesn't compete with the page becoming interactive
    const t = setTimeout(send, 250);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
