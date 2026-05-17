'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';

const SAMPLE = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=70';

type Grid = 'none' | 'thirds' | 'golden' | 'diagonal' | 'centre';

export function CompositionOverlay({ src = SAMPLE }: { src?: string }) {
  const [grid, setGrid] = React.useState<Grid>('thirds');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Composition Overlay</CardTitle>
        <CardDescription>
          Switch grids to see how a photograph is held together by invisible geometry.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={grid} onValueChange={(v) => setGrid(v as Grid)}>
          <TabsList>
            <TabsTrigger value="none">None</TabsTrigger>
            <TabsTrigger value="thirds">Thirds</TabsTrigger>
            <TabsTrigger value="golden">Golden</TabsTrigger>
            <TabsTrigger value="diagonal">Diagonals</TabsTrigger>
            <TabsTrigger value="centre">Centre</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Composition study" className="absolute inset-0 h-full w-full object-cover" />
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none">
            {grid === 'thirds' && (
              <g stroke="white" strokeWidth="0.15" opacity="0.85">
                <line x1="33.33" y1="0" x2="33.33" y2="60" />
                <line x1="66.66" y1="0" x2="66.66" y2="60" />
                <line x1="0" y1="20" x2="100" y2="20" />
                <line x1="0" y1="40" x2="100" y2="40" />
              </g>
            )}
            {grid === 'golden' && (
              <g stroke="white" strokeWidth="0.15" opacity="0.85">
                <line x1="38.2" y1="0" x2="38.2" y2="60" />
                <line x1="61.8" y1="0" x2="61.8" y2="60" />
                <line x1="0" y1="22.9" x2="100" y2="22.9" />
                <line x1="0" y1="37.1" x2="100" y2="37.1" />
              </g>
            )}
            {grid === 'diagonal' && (
              <g stroke="white" strokeWidth="0.15" opacity="0.85">
                <line x1="0" y1="0" x2="100" y2="60" />
                <line x1="100" y1="0" x2="0" y2="60" />
              </g>
            )}
            {grid === 'centre' && (
              <g stroke="white" strokeWidth="0.15" opacity="0.85">
                <line x1="50" y1="0" x2="50" y2="60" />
                <line x1="0" y1="30" x2="100" y2="30" />
                <circle cx="50" cy="30" r="6" fill="none" />
              </g>
            )}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
