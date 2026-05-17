'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full bg-muted" />;
  }

  if (compact) {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    return (
      <button
        onClick={() => setTheme(next)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition"
        aria-label={`Switch to ${next} mode`}
      >
        {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <div className="inline-flex items-center rounded-full bg-muted p-1">
      {(['light', 'system', 'dark'] as const).map((opt) => (
        <button
          key={opt}
          onClick={() => setTheme(opt)}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-fg transition',
            theme === opt && 'bg-card text-foreground shadow-soft'
          )}
          aria-label={opt}
        >
          {opt === 'light' ? (
            <Sun className="h-3.5 w-3.5" />
          ) : opt === 'dark' ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Monitor className="h-3.5 w-3.5" />
          )}
        </button>
      ))}
    </div>
  );
}
