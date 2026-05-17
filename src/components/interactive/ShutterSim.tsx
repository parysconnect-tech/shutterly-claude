'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const STEPS = [
  { label: '1s', s: 1 },
  { label: '1/4', s: 0.25 },
  { label: '1/15', s: 1 / 15 },
  { label: '1/30', s: 1 / 30 },
  { label: '1/60', s: 1 / 60 },
  { label: '1/125', s: 1 / 125 },
  { label: '1/250', s: 1 / 250 },
  { label: '1/500', s: 1 / 500 },
  { label: '1/2000', s: 1 / 2000 }
];

export function ShutterSim() {
  const [i, setI] = React.useState(5);
  const step = STEPS[i];
  const dur = Math.max(0.05, Math.min(2.5, step.s * 60)); // animated rate
  const trail = 1 / step.s; // higher = more trail
  const trailLen = Math.min(160, trail / 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shutter Speed Simulator</CardTitle>
        <CardDescription>
          The cyclist passes by. Long shutter blurs them into a streak; fast shutter freezes the spokes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-b from-amber-100 via-stone-200 to-stone-300 dark:from-stone-700 dark:via-stone-800 dark:to-stone-900">
          {/* Trail */}
          {trailLen > 8 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 rounded-full bg-foreground/40 blur-sm"
              style={{ width: `${trailLen}px`, left: 'calc(50% - 80px)' }}
            />
          )}
          {/* Moving subject */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-rose-500 shadow-soft"
            style={{
              animation: `cyclist ${dur}s linear infinite`,
              left: 0
            }}
          />
          <Badge tone="brand" className="absolute left-3 top-3">{step.label}</Badge>
          <Badge tone="default" className="absolute right-3 top-3">
            {step.s >= 1 / 60 ? 'Motion blur' : step.s >= 1 / 500 ? 'Slightly frozen' : 'Frozen'}
          </Badge>
          <style>{`
            @keyframes cyclist { from { transform: translate(-30%, -50%); } to { transform: translate(130%, -50%); } }
          `}</style>
        </div>

        <div className="space-y-5">
          <Slider
            min={0}
            max={STEPS.length - 1}
            value={i}
            onChange={setI}
            label="Shutter speed"
            format={() => step.label}
          />
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
            <p className="font-medium">
              {step.s >= 1 / 30
                ? 'Use a tripod or steady surface.'
                : step.s >= 1 / 250
                  ? 'Handheld is fine. Most subjects will stay sharp.'
                  : 'Action-freeze territory — perfect for sport, kids and Cape Town wind.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
