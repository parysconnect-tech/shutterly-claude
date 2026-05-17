'use client';

import dynamic from 'next/dynamic';

const map = {
  'exposure-triangle': dynamic(() => import('./ExposureTriangle').then((m) => m.ExposureTriangle)),
  'aperture-sim': dynamic(() => import('./ApertureSim').then((m) => m.ApertureSim)),
  'shutter-sim': dynamic(() => import('./ShutterSim').then((m) => m.ShutterSim)),
  'iso-sim': dynamic(() => import('./IsoSim').then((m) => m.IsoSim)),
  'before-after': dynamic(() => import('./BeforeAfter').then((m) => m.BeforeAfter)),
  'composition-overlay': dynamic(() => import('./CompositionOverlay').then((m) => m.CompositionOverlay)),
  'drag-drop-composition': dynamic(() => import('./DragDropComposition').then((m) => m.DragDropComposition)),
  'histogram-reader': dynamic(() => import('./HistogramReader').then((m) => m.HistogramReader)),
  'white-balance-sim': dynamic(() => import('./WhiteBalanceSim').then((m) => m.WhiteBalanceSim))
} as const;

export type InteractiveKey = keyof typeof map;

export function InteractiveByKey({ which }: { which: string }) {
  const Component = (map as Record<string, any>)[which];
  if (!Component) return null;
  return <Component />;
}
