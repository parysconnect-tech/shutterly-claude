'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface BeforeAfterProps {
  before?: string;
  after?: string;
  caption?: string;
}

export function BeforeAfter({
  before = 'https://images.unsplash.com/photo-1444930694458-01babe71870e?auto=format&fit=crop&w=1400&q=70',
  after = 'https://images.unsplash.com/photo-1444930694458-01babe71870e?auto=format&fit=crop&w=1400&q=70&sat=-30',
  caption = 'Drag the divider to compare a raw frame with a finished edit.'
}: BeforeAfterProps) {
  const [pos, setPos] = React.useState(50);
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  function onPointerDown() { dragging.current = true; }
  function onPointerUp() { dragging.current = false; }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current && e.type !== 'click') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    setPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Before / After</CardTitle>
        <CardDescription>{caption}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={ref}
          className="relative aspect-[16/10] cursor-ew-resize select-none overflow-hidden rounded-2xl bg-stone-200"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClick={(e) => onPointerMove(e as any)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={after} alt="After edit" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${pos}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={before}
              alt="Before edit"
              style={{ width: `${100 * (100 / pos)}%`, filter: 'saturate(0.5) brightness(0.85) contrast(0.85)' }}
              className="absolute inset-0 h-full object-cover max-w-none"
            />
          </div>
          <div
            className="absolute inset-y-0"
            style={{ left: `calc(${pos}% - 1px)` }}
          >
            <div className="h-full w-0.5 bg-white shadow-soft" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" />
              </svg>
            </div>
          </div>
          <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-foreground/70 px-2 py-1 text-xs text-white">
            Before
          </div>
          <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-foreground/70 px-2 py-1 text-xs text-white">
            After
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
