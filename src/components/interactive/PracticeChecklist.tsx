'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Progress } from '@/components/ui/Progress';

interface Item { id: string; label: string; }

export function PracticeChecklist({
  title = 'Practice this week',
  description = 'Tick each item off as you do it. Your progress saves locally.',
  storageKey = 'shutterly:practice',
  items
}: {
  title?: string;
  description?: string;
  storageKey?: string;
  items: Item[];
}) {
  const [state, setState] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    try { setState(JSON.parse(localStorage.getItem(storageKey) ?? '{}')); } catch {}
  }, [storageKey]);
  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  const done = items.filter((it) => state[it.id]).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={pct} showLabel />
        <ul className="mt-4 space-y-2">
          {items.map((it) => (
            <li key={it.id}>
              <Checkbox
                label={it.label}
                checked={!!state[it.id]}
                onChange={(e) => setState((s) => ({ ...s, [it.id]: e.target.checked }))}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
