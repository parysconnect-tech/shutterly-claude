'use client';

// Scroll-tracked reading progress bar.
// Sticks just below the global Header, shows how far through the article you are.

import * as React from 'react';

export function ReadingProgress({ targetId = 'lesson-article' }: { targetId?: string }) {
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setPct(100);
        return;
      }
      const scrolled = Math.max(0, -rect.top);
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      setPct(Math.round(ratio * 100));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-16 z-30 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
