'use client';

// Pure-SVG bar/area chart — no charting lib needed.
// Two series: views (filled gradient) + unique visitors (line).

import * as React from 'react';

type Point = { date: string; views: number; uniques: number };

export function ViewsChart({ data }: { data: Point[] }) {
  const [hover, setHover] = React.useState<number | null>(null);

  const W = 800;
  const H = 220;
  const PADDING = { top: 16, right: 12, bottom: 24, left: 36 };
  const innerW = W - PADDING.left - PADDING.right;
  const innerH = H - PADDING.top - PADDING.bottom;

  const max = Math.max(1, ...data.map((d) => d.views));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const xFor = (i: number) => PADDING.left + i * stepX;
  const yFor = (v: number) => PADDING.top + innerH - (v / max) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(d.views)}`).join(' ');
  const areaPath = `${linePath} L${xFor(data.length - 1)},${PADDING.top + innerH} L${xFor(0)},${PADDING.top + innerH} Z`;
  const uniquesPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(d.uniques)}`).join(' ');

  // Y axis ticks
  const ticks = [0, Math.round(max / 2), max];

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f57f04" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f57f04" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y axis gridlines + labels */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PADDING.left}
              x2={PADDING.left + innerW}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="hsl(var(--border))"
              strokeDasharray="2 4"
            />
            <text
              x={PADDING.left - 6}
              y={yFor(t)}
              dy="0.32em"
              textAnchor="end"
              className="fill-current text-[10px] text-muted-fg"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Area under views */}
        <path d={areaPath} fill="url(#viewsFill)" />

        {/* Views line */}
        <path d={linePath} fill="none" stroke="#f57f04" strokeWidth="2" />

        {/* Unique visitors line (dashed) */}
        <path
          d={uniquesPath}
          fill="none"
          stroke="#308dff"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Hover capture + dots */}
        {data.map((d, i) => (
          <g
            key={d.date}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <rect
              x={xFor(i) - stepX / 2}
              y={PADDING.top}
              width={stepX}
              height={innerH}
              fill="transparent"
            />
            {hover === i && (
              <>
                <line
                  x1={xFor(i)}
                  x2={xFor(i)}
                  y1={PADDING.top}
                  y2={PADDING.top + innerH}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
                <circle cx={xFor(i)} cy={yFor(d.views)} r="3.5" fill="#f57f04" />
                <circle cx={xFor(i)} cy={yFor(d.uniques)} r="3" fill="#308dff" />
              </>
            )}
          </g>
        ))}

        {/* X axis labels — every 5th day */}
        {data.map((d, i) => {
          if (i % 5 !== 0 && i !== data.length - 1) return null;
          const day = d.date.slice(5).replace('-', '/');
          return (
            <text
              key={d.date}
              x={xFor(i)}
              y={H - 6}
              textAnchor="middle"
              className="fill-current text-[10px] text-muted-fg"
            >
              {day}
            </text>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: `${((PADDING.left + hover * stepX) / W) * 100}%`,
            top: '4px',
            transform: 'translateX(-50%)',
          }}
        >
          <p className="font-medium">{data[hover].date}</p>
          <p className="text-muted-fg">
            <span className="text-brand-600">●</span> {data[hover].views} views
          </p>
          <p className="text-muted-fg">
            <span className="text-accent-600">●</span> {data[hover].uniques} unique
          </p>
        </div>
      )}

      <div className="mt-2 flex items-center justify-end gap-4 text-xs text-muted-fg">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-brand-500" /> Views
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-accent-500" style={{ borderTop: '1.5px dashed' }} /> Unique
        </span>
      </div>
    </div>
  );
}
