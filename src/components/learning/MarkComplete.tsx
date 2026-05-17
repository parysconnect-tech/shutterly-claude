'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function MarkComplete({
  courseSlug,
  moduleSlug,
  lessonSlug
}: {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  const [done, setDone] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function complete() {
    setLoading(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug, moduleSlug, lessonSlug, status: 'completed', percent: 100 })
      });
      if (res.ok) {
        setDone(true);
        toast.success('Lesson saved as complete.');
      }
    } catch {
      toast.error('Could not save progress.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={complete} loading={loading} disabled={done} variant={done ? 'outline' : 'primary'}>
      <Check className="h-4 w-4" />
      {done ? 'Marked complete' : 'Mark complete'}
    </Button>
  );
}
