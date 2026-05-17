'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function HistogramReader() {
  const [exposure, setExposure] = React.useState(0); // -3..+3
  const [contrast, setContrast] = React.useState(1); // 0.5..1.8

  const bins = 32;
  const data = React.useMemo(() => {
    // Simulated bell-curve tones shifted by exposure, stretched by contrast.
    return Array.from({ length: bins }, (_, i) => {
      const x = (i / (bins - 1)) - 0.5;
      const shifted = x - exposure * 0.18;
      const stretched = shifted * contrast;
      const v = Math.exp(-(stretched * stretched) * 18);
      return Math.max(0.01, v);
    });
  }, [exposure, contrast]);

  const clipL = data[0] > 0.5;
  const clipR = data[bins - 1] > 0.5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Read the Histogram</CardTitle>
        <CardDescription>
          Drag the sliders and watch the curve drift, stretch and clip against the walls.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex h-40 items-end gap-0.5">
            {data.map((v, i) => {
              const tone =
                i < bins / 3 ? 'bg-stone-700' : i < (bins * 2) / 3 ? 'bg-stone-400' : 'bg-stone-200';
              return <div key={i} className={`${tone} flex-1 rounded-sm`} style={{ height: `${v * 100}%` }} />;
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-muted-fg">
            <span>Shadows</span><span>Mid-tones</span><span>Highlights</span>
          </div>
          <div className="mt-3 flex gap-2">
            {clipL && <Badge tone="danger">Crushed shadows</Badge>}
            {clipR && <Badge tone="danger">Blown highlights</Badge>}
            {!clipL && !clipR && <Badge tone="success">Headroom on both sides</Badge>}
          </div>
        </div>

        <div className="space-y-5">
          <Slider
            min={-3}
            max={3}
            step={0.1}
            value={exposure}
            onChange={setExposure}
            label="Exposure (stops)"
            format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`}
          />
          <Slider
            min={0.5}
            max={1.8}
            step={0.05}
            value={contrast}
            onChange={setContrast}
            label="Contrast"
            format={(v) => v.toFixed(2)}
          />
          <p className="text-xs text-muted-fg">
            Tip: aim for a curve that <em>kisses</em> both walls without stacking against them. Clipping on one side means lost detail there.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
