import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, withMark = true }: { className?: string; withMark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-2 font-display text-xl tracking-tight', className)}
      aria-label="Shutterly"
    >
      {withMark && (
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-brand-fg shadow-soft">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="13" r="4" />
            <path d="M3 9a2 2 0 0 1 2-2h2l1.5-2.4A2 2 0 0 1 10.2 4h3.6a2 2 0 0 1 1.7.9L17 7h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
          </svg>
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent-400 ring-2 ring-card" />
        </span>
      )}
      <span className="font-semibold">
        Shutter<span className="text-brand-600 dark:text-brand-300">ly</span>
      </span>
    </Link>
  );
}
