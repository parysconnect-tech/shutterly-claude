'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';

type Item = { id: string; emoji: string; x: number; y: number; label: string };

const DEFAULTS: Item[] = [
  { id: 'mountain', emoji: '⛰️', x: 50, y: 60, label: 'Mountain' },
  { id: 'tree',     emoji: '🌳', x: 20, y: 80, label: 'Tree' },
  { id: 'person',   emoji: '🧍', x: 80, y: 78, label: 'Person' },
  { id: 'sun',      emoji: '☀️', x: 70, y: 20, label: 'Sun' }
];

export function DragDropComposition() {
  const [items, setItems] = React.useState<Item[]>(DEFAULTS);
  const [grid, setGrid] = React.useState(true);
  const boardRef = React.useRef<HTMLDivElement>(null);

  function startDrag(id: string) {
    const onMove = (e: PointerEvent) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, x, y } : it)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose the Frame</CardTitle>
        <CardDescription>
          Drag the elements. Feel how the eye moves when subjects sit on intersections, not in the centre.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={grid}
              onChange={(e) => setGrid(e.target.checked)}
              className="accent-brand-500"
            />
            Show thirds grid
          </label>
          <Button size="sm" variant="ghost" onClick={() => setItems(DEFAULTS)}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>
        <div
          ref={boardRef}
          className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-b from-sky-200 to-stone-200 dark:from-sky-900 dark:to-stone-800"
        >
          {grid && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none">
              <g stroke="white" strokeWidth="0.2" opacity="0.7">
                <line x1="33.33" y1="0" x2="33.33" y2="60" />
                <line x1="66.66" y1="0" x2="66.66" y2="60" />
                <line x1="0" y1="20" x2="100" y2="20" />
                <line x1="0" y1="40" x2="100" y2="40" />
              </g>
            </svg>
          )}
          {items.map((it) => (
            <button
              key={it.id}
              onPointerDown={() => startDrag(it.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl select-none cursor-grab active:cursor-grabbing"
              style={{ left: `${it.x}%`, top: `${it.y}%` }}
              aria-label={it.label}
            >
              {it.emoji}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
