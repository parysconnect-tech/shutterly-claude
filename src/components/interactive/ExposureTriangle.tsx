'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

// Each step is a "stop" on the photographic scale.
// We translate aperture, shutter, ISO into an EV total and compare to a target EV.
const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];          // wider → narrower
const SHUTTERS = [
  { s: 1, label: '1s' },
  { s: 1 / 2, label: '1/2' },
  { s: 1 / 8, label: '1/8' },
  { s: 1 / 30, label: '1/30' },
  { s: 1 / 60, label: '1/60' },
  { s: 1 / 125, label: '1/125' },
  { s: 1 / 250, label: '1/250' },
  { s: 1 / 500, label: '1/500' },
  { s: 1 / 1000, label: '1/1000' },
  { s: 1 / 2000, label: '1/2000' }
];
const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800];

function ev(aperture: number, shutter: number, iso: number) {
  // EV = log2(aperture^2 / shutter) - log2(iso/100)
  return Math.log2((aperture * aperture) / shutter) - Math.log2(iso / 100);
}

export function ExposureTriangle() {
  const [apI, setApI] = React.useState(3);  // f/4
  const [shI, setShI] = React.useState(5);  // 1/125
  const [isI, setIsI] = React.useState(0);  // 100

  const aperture = APERTURES[apI];
  const shutter = SHUTTERS[shI];
  const iso = ISOS[isI];

  const targetEV = 10; // mid-day exposure baseline
  const myEV = ev(aperture, shutter.s, iso);
  const diff = myEV - targetEV; // positive = under, negative = over (since higher EV = less light needed)
  const brightnessPct = Math.max(8, Math.min(180, 100 * Math.pow(2, -diff)));

  // Visualise depth of field (aperture), motion blur (shutter), and noise (iso)
  const dofBlur = (aperture / 16) * 8; // 0..4px
  const motionBlurX = (1 / shutter.s) < 60 ? Math.min(40, 60 / (1 / shutter.s)) : 0;
  const noiseOpacity = Math.min(0.55, (Math.log2(iso / 100) / 7) * 0.55);

  const exposureLabel =
    diff < -2 ? 'Over-exposed' : diff > 2 ? 'Under-exposed' : Math.abs(diff) < 0.3 ? 'Spot on' : diff < 0 ? 'A touch bright' : 'A touch dark';

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Exposure Triangle Simulator</CardTitle>
        <CardDescription>
          Move any slider. Notice that brightness, depth of field, motion and noise are all the same story.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* Preview */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900">
          {/* Sky */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-amber-200 via-rose-300 to-rose-400" />
          {/* Ground */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-stone-700 to-stone-900" />
          {/* Mountain silhouette */}
          <svg viewBox="0 0 400 300" className="absolute inset-x-0 bottom-1/3 w-full">
            <polygon points="0,300 80,150 140,200 220,90 300,180 400,140 400,300" fill="rgb(20,20,24)" opacity="0.92" />
          </svg>
          {/* Foreground figure */}
          <div
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-stone-100"
            style={{
              filter: `blur(${dofBlur}px) brightness(${brightnessPct}%)`,
              transform: `translate(-50%, -10%) translateX(${motionBlurX}px)`,
              transition: 'all 220ms ease'
            }}
          />
          {/* Brightness veil */}
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background: `rgba(0,0,0,${diff > 0 ? Math.min(0.8, diff / 5) : 0})`,
              transition: 'background 220ms ease'
            }}
          />
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background: `rgba(255,255,255,${diff < 0 ? Math.min(0.6, -diff / 5) : 0})`,
              transition: 'background 220ms ease'
            }}
          />
          {/* Noise overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: noiseOpacity,
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
              mixBlendMode: 'overlay'
            }}
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            <Badge tone="brand">f/{aperture}</Badge>
            <Badge tone="accent">{shutter.label}</Badge>
            <Badge tone="default">ISO {iso}</Badge>
          </div>
          <div className="absolute right-3 top-3">
            <Badge
              tone={Math.abs(diff) < 0.5 ? 'success' : Math.abs(diff) < 1.5 ? 'warning' : 'danger'}
            >
              {exposureLabel}
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <Slider
            min={0}
            max={APERTURES.length - 1}
            value={apI}
            onChange={setApI}
            label="Aperture (wider ← → narrower)"
            format={() => `f/${APERTURES[apI]}`}
          />
          <Slider
            min={0}
            max={SHUTTERS.length - 1}
            value={shI}
            onChange={setShI}
            label="Shutter (longer ← → faster)"
            format={() => SHUTTERS[shI].label}
          />
          <Slider
            min={0}
            max={ISOS.length - 1}
            value={isI}
            onChange={setIsI}
            label="ISO (clean ← → noisy)"
            format={() => `ISO ${ISOS[isI]}`}
          />
          <div className={cn(
            'mt-2 rounded-xl border border-border bg-muted/40 p-3 text-sm',
            'flex items-center justify-between'
          )}>
            <span className="text-muted-fg">EV difference</span>
            <span className="font-mono">{diff.toFixed(1)} stops</span>
          </div>
          <p className="text-xs text-muted-fg">
            Try this: open the aperture by 2 stops, then make shutter twice as fast — twice. The image stays the same brightness but loses depth of field and motion blur.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
