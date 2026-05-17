'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function WhiteBalanceSim({
  src = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=70'
}: {
  src?: string;
}) {
  const [kelvin, setKelvin] = React.useState(5500);
  const [tint, setTint] = React.useState(0);

  // Translate kelvin to a colour tint.
  const warm = kelvin < 5500 ? (5500 - kelvin) / 3500 : 0;
  const cool = kelvin > 5500 ? (kelvin - 5500) / 5000 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>White Balance Simulator</CardTitle>
        <CardDescription>
          Same scene, four different white balances. The colour cast lives in the camera, not the world.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0 mix-blend-color"
            style={{
              background: `rgba(${255 * warm}, ${120 * warm}, ${30 * warm}, ${warm * 0.55})`
            }}
          />
          <div
            className="absolute inset-0 mix-blend-color"
            style={{
              background: `rgba(${30 * cool}, ${120 * cool}, ${255 * cool}, ${cool * 0.5})`
            }}
          />
          <div
            className="absolute inset-0 mix-blend-color"
            style={{
              background: `rgba(${tint > 0 ? 200 : 30}, ${tint > 0 ? 30 : 200}, ${tint > 0 ? 200 : 30}, ${Math.abs(tint) / 80})`
            }}
          />
          <Badge tone="brand" className="absolute left-3 top-3">{kelvin} K</Badge>
        </div>
        <div className="space-y-5">
          <Slider
            min={2000}
            max={10000}
            step={100}
            value={kelvin}
            onChange={setKelvin}
            label="Temperature (Kelvin)"
            format={(v) => `${v} K`}
          />
          <Slider
            min={-50}
            max={50}
            value={tint}
            onChange={setTint}
            label="Tint (green ↔ magenta)"
          />
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { k: 3000, name: 'Tungsten' },
              { k: 4500, name: 'Fluorescent' },
              { k: 5500, name: 'Daylight' },
              { k: 7500, name: 'Overcast' }
            ].map((p) => (
              <button
                key={p.k}
                onClick={() => setKelvin(p.k)}
                className="rounded-xl border border-border p-2 hover:bg-muted"
              >
                <span className="block font-medium">{p.name}</span>
                <span className="text-muted-fg">{p.k} K</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
