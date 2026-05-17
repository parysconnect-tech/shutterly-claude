'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const F_STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];

export function ApertureSim() {
  const [i, setI] = React.useState(2);
  const f = F_STOPS[i];
  const bgBlur = Math.max(0, (16 - f) * 1.3); // px
  const fgBlur = Math.max(0, (f - 1.4) * 0.4);
  const irisSize = 100 - (i / (F_STOPS.length - 1)) * 70;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperture Simulator</CardTitle>
        <CardDescription>
          Watch the iris close as the f-number rises. Foreground sharpens, background loses its glow.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-900">
          {/* Background bokeh dots */}
          <div className="absolute inset-0" style={{ filter: `blur(${bgBlur}px)` }}>
            {Array.from({ length: 20 }).map((_, k) => (
              <span
                key={k}
                className="absolute rounded-full"
                style={{
                  left: `${(k * 53) % 100}%`,
                  top: `${(k * 37) % 100}%`,
                  width: `${10 + (k % 5) * 5}px`,
                  height: `${10 + (k % 5) * 5}px`,
                  background: ['#f59e0b', '#ef4444', '#22d3ee', '#a855f7', '#fff'][k % 5],
                  opacity: 0.45
                }}
              />
            ))}
          </div>
          {/* Foreground subject */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-gradient-to-br from-amber-300 to-rose-500 shadow-2xl"
            style={{ filter: `blur(${fgBlur}px)` }}
          />
          <Badge tone="brand" className="absolute left-3 top-3">f/{f}</Badge>
        </div>

        <div className="space-y-5">
          {/* Iris visualisation */}
          <div className="mx-auto h-40 w-40 rounded-full bg-stone-900 p-2 ring-2 ring-border">
            <div
              className="h-full w-full rounded-full bg-amber-200 shadow-inner transition-all duration-300"
              style={{ transform: `scale(${irisSize / 100})` }}
            />
          </div>
          <Slider
            min={0}
            max={F_STOPS.length - 1}
            value={i}
            onChange={setI}
            label="Aperture"
            format={() => `f/${f}`}
          />
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
            <p>
              <strong>{f <= 2.8 ? 'Shallow' : f >= 8 ? 'Deep' : 'Moderate'}</strong> depth of field.
              {' '}
              {f <= 2.8 && 'Great for portraits, weak for group shots.'}
              {f > 2.8 && f < 8 && 'A safe middle for two-person portraits.'}
              {f >= 8 && 'Landscapes stay sharp from foreground to horizon.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
