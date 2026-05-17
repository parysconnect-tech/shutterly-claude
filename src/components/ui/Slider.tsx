'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  label?: string;
  format?: (v: number) => string;
  marks?: number[];
  className?: string;
  trackClassName?: string;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  format,
  marks,
  className,
  trackClassName
}: SliderProps) {
  const id = React.useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn('w-full select-none', className)}>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <label htmlFor={id} className="text-muted-fg">
            {label}
          </label>
          <span className="font-mono font-medium tabular-nums">
            {format ? format(value) : value}
          </span>
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            'h-2 w-full appearance-none rounded-full bg-muted accent-brand-500',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500',
            '[&::-webkit-slider-thumb]:shadow-soft [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
            '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-500',
            trackClassName
          )}
          style={{
            background: `linear-gradient(to right, hsl(var(--ring)) 0%, hsl(var(--ring)) ${pct}%, hsl(var(--muted)) ${pct}%, hsl(var(--muted)) 100%)`
          }}
        />
        {marks && (
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-between px-1 text-[10px] text-muted-fg">
            {marks.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
