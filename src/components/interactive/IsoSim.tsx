'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

export function IsoSim() {
  const [i, setI] = React.useState(0);
  const iso = ISOS[i];
  const noise = Math.min(0.85, (Math.log2(iso / 100) / 8) * 0.85);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ISO &amp; Noise Comparison</CardTitle>
        <CardDescription>
          Same scene, same exposure. Watch the grain bloom as ISO climbs.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=900&q=70"
            alt="Photo subject"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              opacity: noise,
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"
            }}
          />
          <Badge tone="brand" className="absolute left-3 top-3">ISO {iso}</Badge>
        </div>

        <div className="space-y-5">
          <Slider
            min={0}
            max={ISOS.length - 1}
            value={i}
            onChange={setI}
            label="ISO"
            format={() => `${iso}`}
          />
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
            <p>
              {iso <= 400 && 'Clean territory — daylight and tripod work.'}
              {iso > 400 && iso <= 3200 && 'Indoor handheld. Modern cameras handle this easily.'}
              {iso > 3200 && 'Last-resort or atmospheric. Embrace the grain.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
