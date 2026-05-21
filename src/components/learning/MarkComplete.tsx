'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function MarkComplete({
  courseSlug,
  moduleSlug,
  lessonSlug,
}: {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  const [done, setDone] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [celebrate, setCelebrate] = React.useState(false);

  async function complete() {
    setLoading(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug,
          moduleSlug,
          lessonSlug,
          status: 'completed',
          percent: 100,
        }),
      });
      if (res.ok) {
        setDone(true);
        setCelebrate(true);
        toast.success('Lesson saved as complete. Another frame in the bag.');
        setTimeout(() => setCelebrate(false), 1800);
      }
    } catch {
      toast.error('Could not save progress.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border p-4 transition-all',
        done
          ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-emerald-950/30'
          : 'border-border bg-card'
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all',
          done
            ? 'bg-emerald-500 text-white'
            : 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
          celebrate && 'animate-pulse'
        )}
      >
        {done ? <Check className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{done ? "Lesson complete — nice work." : 'Ready to wrap up?'}</p>
        <p className="mt-0.5 text-sm text-muted-fg">
          {done
            ? "Your progress is saved. Take a breath, then move to the next one."
            : 'Mark this lesson complete to track your progress.'}
        </p>
      </div>
      <Button
        onClick={complete}
        loading={loading}
        disabled={done}
        variant={done ? 'outline' : 'primary'}
      >
        <Check className="h-4 w-4" />
        {done ? 'Done' : 'Mark complete'}
      </Button>
    </div>
  );
}
