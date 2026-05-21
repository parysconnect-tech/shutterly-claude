// Educational SVG diagrams — pure inline SVG, no external assets, work in light + dark.
// Each diagram is a small self-contained component. Reference by key from lesson body:
//   [[diagram:light-direction]]

import * as React from 'react';

export const diagramRegistry: Record<string, React.ComponentType> = {
  'light-direction': LightDirectionDiagram,
  'exposure-triangle': ExposureTriangleDiagram,
  'depth-of-field': DepthOfFieldDiagram,
  'rule-of-thirds': RuleOfThirdsDiagram,
  'golden-hour-clock': GoldenHourClockDiagram,
  'one-light-setups': OneLightSetupsDiagram,
  'shutter-stories': ShutterStoriesDiagram,
  'histogram-zones': HistogramZonesDiagram,
  'four-questions': FourQuestionsDiagram,
};

export function Diagram({ which }: { which: string }) {
  const Comp = diagramRegistry[which];
  if (!Comp) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-fg">
        Diagram &ldquo;{which}&rdquo; not found
      </div>
    );
  }
  return (
    <figure className="my-8 rounded-2xl border border-border bg-gradient-to-br from-card to-card/40 p-5">
      <Comp />
    </figure>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// LightDirectionDiagram — four mini cards showing front / side / back / top
// ──────────────────────────────────────────────────────────────────────────
function LightDirectionDiagram() {
  const variants = [
    { label: 'Front-light', desc: 'Flat, soft, even', sunX: 50, shadowX: 50, shadowOp: 0.15 },
    { label: 'Side-light', desc: 'Sculpts, dramatic', sunX: 88, shadowX: 35, shadowOp: 0.5 },
    { label: 'Back-light', desc: 'Silhouettes, rim', sunX: 50, shadowX: 50, shadowOp: 0.0, backlit: true },
    { label: 'Top-light', desc: 'Harsh, hollow eyes', sunX: 50, sunY: 12, shadowX: 50, shadowOp: 0.4, top: true },
  ] as Array<{ label: string; desc: string; sunX: number; sunY?: number; shadowX: number; shadowOp: number; backlit?: boolean; top?: boolean }>;
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        Four directions of light
      </figcaption>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {variants.map((v) => (
          <div key={v.label} className="rounded-xl border border-border bg-background p-3">
            <svg viewBox="0 0 100 100" className="h-24 w-full">
              {/* ground */}
              <line x1="10" y1="80" x2="90" y2="80" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
              {/* shadow */}
              <ellipse
                cx={v.shadowX}
                cy={80}
                rx={v.label === 'Top-light' ? 6 : 14}
                ry="2"
                fill="black"
                fillOpacity={v.shadowOp}
              />
              {/* person silhouette */}
              <circle cx={50} cy={48} r={6} fill={v.backlit ? '#222' : '#f5b876'} />
              <rect x={43} y={54} width={14} height={26} rx={3} fill={v.backlit ? '#222' : '#3b6fbf'} />
              {/* rim/halo for backlight */}
              {v.backlit && (
                <>
                  <circle cx={50} cy={48} r={7} fill="none" stroke="#fde68a" strokeWidth="1.5" />
                  <rect x={42} y={54} width={16} height={26} rx={3} fill="none" stroke="#fde68a" strokeWidth="1" />
                </>
              )}
              {/* sun */}
              <circle cx={v.sunX} cy={v.sunY ?? 22} r={5} fill="#fbbf24" />
              {/* rays */}
              <line
                x1={v.sunX}
                y1={(v.sunY ?? 22) + 5}
                x2={50}
                y2={48}
                stroke="#fbbf24"
                strokeOpacity="0.4"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </svg>
            <p className="mt-1 text-center text-[11px] font-semibold">{v.label}</p>
            <p className="text-center text-[10px] text-muted-fg">{v.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ExposureTriangleDiagram — labeled equilateral triangle
// ──────────────────────────────────────────────────────────────────────────
function ExposureTriangleDiagram() {
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        The exposure triangle
      </figcaption>
      <div className="mx-auto max-w-md">
        <svg viewBox="0 0 300 280" className="h-auto w-full">
          <defs>
            <linearGradient id="triFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f57f04" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#308dff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <polygon points="150,30 280,250 20,250" fill="url(#triFill)" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />

          {/* Aperture - top */}
          <g>
            <circle cx={150} cy={30} r={28} fill="#f57f04" />
            <text x={150} y={35} textAnchor="middle" className="text-[11px] font-bold fill-white">APERTURE</text>
            <text x={150} y={80} textAnchor="middle" className="fill-current text-[11px]" fillOpacity="0.7">depth of field</text>
          </g>

          {/* Shutter - bottom right */}
          <g>
            <circle cx={280} cy={250} r={28} fill="#308dff" />
            <text x={280} y={255} textAnchor="middle" className="text-[11px] font-bold fill-white">SHUTTER</text>
            <text x={280} y={210} textAnchor="middle" className="fill-current text-[11px]" fillOpacity="0.7">motion</text>
          </g>

          {/* ISO - bottom left */}
          <g>
            <circle cx={20} cy={250} r={28} fill="#16a34a" />
            <text x={20} y={255} textAnchor="middle" className="text-[10px] font-bold fill-white">ISO</text>
            <text x={20} y={210} textAnchor="middle" className="fill-current text-[11px]" fillOpacity="0.7">noise</text>
          </g>

          {/* Center label */}
          <text x={150} y={170} textAnchor="middle" className="fill-current text-[14px] font-bold">EXPOSURE</text>
          <text x={150} y={188} textAnchor="middle" className="fill-current text-[10px]" fillOpacity="0.6">change one — balance another</text>
        </svg>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// DepthOfFieldDiagram — aperture vs blur zones
// ──────────────────────────────────────────────────────────────────────────
function DepthOfFieldDiagram() {
  const examples = [
    { f: 'f/1.8', zone: 8, label: 'thin slice sharp' },
    { f: 'f/4', zone: 24, label: 'subject sharp' },
    { f: 'f/8', zone: 60, label: 'most scene sharp' },
    { f: 'f/16', zone: 90, label: 'edge to edge' },
  ];
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        Aperture &amp; depth of field
      </figcaption>
      <div className="space-y-2">
        {examples.map((ex) => (
          <div key={ex.f} className="flex items-center gap-3">
            <span className="w-12 shrink-0 font-mono text-sm font-bold tabular-nums">{ex.f}</span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-gradient-to-r from-foreground/10 via-foreground/5 to-foreground/10">
              <div
                className="absolute top-0 h-full rounded-md bg-gradient-to-r from-brand-400 to-brand-600"
                style={{ left: `${50 - ex.zone / 2}%`, width: `${ex.zone}%` }}
              />
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-background" />
            </div>
            <span className="w-32 shrink-0 text-right text-[11px] text-muted-fg">{ex.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-fg">
        Orange band = the zone of sharpness around your focus point
      </p>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// RuleOfThirdsDiagram — grid with hot points
// ──────────────────────────────────────────────────────────────────────────
function RuleOfThirdsDiagram() {
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        Rule of thirds — hot points
      </figcaption>
      <div className="mx-auto max-w-lg">
        <svg viewBox="0 0 300 200" className="h-auto w-full rounded-lg bg-gradient-to-br from-amber-100 via-amber-50 to-sky-100 dark:from-amber-950/40 dark:via-amber-900/20 dark:to-sky-950/40">
          {/* horizon suggestion */}
          <line x1="0" y1="133" x2="300" y2="133" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />

          {/* Grid lines */}
          <line x1="100" y1="0" x2="100" y2="200" stroke="white" strokeOpacity="0.7" strokeDasharray="3 3" />
          <line x1="200" y1="0" x2="200" y2="200" stroke="white" strokeOpacity="0.7" strokeDasharray="3 3" />
          <line x1="0" y1="67" x2="300" y2="67" stroke="white" strokeOpacity="0.7" strokeDasharray="3 3" />
          <line x1="0" y1="133" x2="300" y2="133" stroke="white" strokeOpacity="0.7" strokeDasharray="3 3" />

          {/* Hot points */}
          {[[100, 67], [200, 67], [100, 133], [200, 133]].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="10" fill="#f57f04" fillOpacity="0.2" />
              <circle cx={x} cy={y} r="5" fill="#f57f04" />
            </g>
          ))}

          {/* Sample subject placement */}
          <circle cx={200} cy={67} r="14" fill="#1a0e00" />
        </svg>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-fg">
        Place subjects on the intersections, not the centre — the eye finds them faster
      </p>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// GoldenHourClockDiagram
// ──────────────────────────────────────────────────────────────────────────
function GoldenHourClockDiagram() {
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        When to shoot — daily light cycle
      </figcaption>
      <div className="mx-auto max-w-md">
        <svg viewBox="0 0 300 300" className="h-auto w-full">
          <defs>
            <radialGradient id="dayRing">
              <stop offset="80%" stopColor="transparent" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <circle cx="150" cy="150" r="130" fill="url(#dayRing)" stroke="currentColor" strokeOpacity="0.15" />

          {/* Blue hour arcs (morning + evening) */}
          <path d="M 150 20 A 130 130 0 0 1 246 95" fill="none" stroke="#1e40af" strokeWidth="10" strokeOpacity="0.4" />
          <path d="M 246 205 A 130 130 0 0 1 150 280" fill="none" stroke="#1e40af" strokeWidth="10" strokeOpacity="0.4" />

          {/* Golden hour arcs */}
          <path d="M 246 95 A 130 130 0 0 1 246 95" fill="none" />
          <path d="M 150 20 A 130 130 0 0 0 54 95" fill="none" stroke="#fbbf24" strokeWidth="10" strokeOpacity="0.8" />
          <path d="M 54 205 A 130 130 0 0 0 150 280" fill="none" stroke="#fbbf24" strokeWidth="10" strokeOpacity="0.8" />

          {/* Harsh midday */}
          <path d="M 54 95 A 130 130 0 0 0 54 205" fill="none" stroke="#f87171" strokeWidth="10" strokeOpacity="0.5" />
          {/* Night arc */}
          <path d="M 246 95 A 130 130 0 0 1 246 205" fill="none" stroke="#1e1b4b" strokeWidth="10" strokeOpacity="0.7" />

          {/* Labels */}
          <text x="150" y="14" textAnchor="middle" className="fill-current text-[10px] font-semibold">12 NOON</text>
          <text x="290" y="155" textAnchor="middle" className="fill-current text-[10px] font-semibold">SUNSET</text>
          <text x="150" y="296" textAnchor="middle" className="fill-current text-[10px] font-semibold">MIDNIGHT</text>
          <text x="10" y="155" textAnchor="middle" className="fill-current text-[10px] font-semibold">SUNRISE</text>

          {/* Sun in the center with face */}
          <circle cx="150" cy="150" r="34" fill="#fbbf24" />
          <text x="150" y="148" textAnchor="middle" className="text-[10px] font-bold fill-white">GOLDEN</text>
          <text x="150" y="160" textAnchor="middle" className="text-[10px] font-bold fill-white">HOUR</text>
        </svg>
        <div className="mt-3 flex flex-wrap justify-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-3 rounded bg-amber-400" /> Golden hour</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-3 rounded bg-blue-700" /> Blue hour</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-3 rounded bg-red-400" /> Harsh midday</span>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// OneLightSetupsDiagram — three patterns (Rembrandt, backlight+reflector, off-camera low)
// ──────────────────────────────────────────────────────────────────────────
function OneLightSetupsDiagram() {
  const setups = [
    {
      name: 'Rembrandt',
      desc: '45° up + 45° to the side. Triangle on the far cheek.',
      lightX: 75, lightY: 25,
    },
    {
      name: 'Back + reflector',
      desc: 'Light behind subject, white card returning fill.',
      lightX: 50, lightY: 80,
      reflector: true,
    },
    {
      name: 'Off-camera low',
      desc: 'Light at table height, side. Moody and graphic.',
      lightX: 80, lightY: 70,
    },
  ];
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        Three one-light recipes
      </figcaption>
      <div className="grid gap-3 sm:grid-cols-3">
        {setups.map((s) => (
          <div key={s.name} className="rounded-xl border border-border bg-background p-3">
            <svg viewBox="0 0 100 100" className="h-28 w-full">
              {/* camera */}
              <rect x={42} y={88} width={16} height={8} rx={1} fill="currentColor" fillOpacity="0.5" />
              <circle cx={50} cy={92} r={3} fill="currentColor" fillOpacity="0.3" />

              {/* subject */}
              <circle cx={50} cy={42} r={8} fill="#f5b876" />
              <rect x={42} y={50} width={16} height={20} rx={3} fill="#475569" />

              {/* light */}
              <circle cx={s.lightX} cy={s.lightY} r={5} fill="#fbbf24" />
              <line
                x1={s.lightX}
                y1={s.lightY}
                x2={50}
                y2={42}
                stroke="#fbbf24"
                strokeOpacity="0.6"
                strokeDasharray="2 2"
              />
              {/* reflector */}
              {s.reflector && (
                <rect x={20} y={28} width={4} height={20} fill="white" stroke="currentColor" strokeOpacity="0.4" />
              )}
            </svg>
            <p className="mt-1 text-center text-[11px] font-semibold">{s.name}</p>
            <p className="mt-0.5 text-center text-[10px] text-muted-fg">{s.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ShutterStoriesDiagram — three speeds with motion illustration
// ──────────────────────────────────────────────────────────────────────────
function ShutterStoriesDiagram() {
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        Three shutter speeds, three stories
      </figcaption>
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Freeze */}
        <div className="rounded-xl border border-border bg-background p-3">
          <svg viewBox="0 0 100 60" className="h-20 w-full">
            <rect width="100" height="60" fill="#0ea5e9" fillOpacity="0.1" rx="6" />
            <circle cx="50" cy="30" r="6" fill="#0ea5e9" />
            <path d="M 50 36 L 48 50 L 52 50 Z" fill="#0ea5e9" />
          </svg>
          <p className="mt-1 text-center text-[11px] font-semibold">1/2000s · Freeze</p>
          <p className="text-center text-[10px] text-muted-fg">A wave at Muizenberg, mid-crash</p>
        </div>
        {/* Blur */}
        <div className="rounded-xl border border-border bg-background p-3">
          <svg viewBox="0 0 100 60" className="h-20 w-full">
            <rect width="100" height="60" fill="#facc15" fillOpacity="0.1" rx="6" />
            <ellipse cx="40" cy="30" rx="20" ry="6" fill="#facc15" fillOpacity="0.4" />
            <ellipse cx="50" cy="30" rx="14" ry="5" fill="#facc15" fillOpacity="0.7" />
            <ellipse cx="60" cy="30" rx="8" ry="4" fill="#facc15" />
          </svg>
          <p className="mt-1 text-center text-[11px] font-semibold">1/8s · Blur</p>
          <p className="text-center text-[10px] text-muted-fg">A taxi in Joburg as a streak</p>
        </div>
        {/* Pan */}
        <div className="rounded-xl border border-border bg-background p-3">
          <svg viewBox="0 0 100 60" className="h-20 w-full">
            <rect width="100" height="60" fill="#a855f7" fillOpacity="0.1" rx="6" />
            <line x1="10" y1="20" x2="90" y2="20" stroke="#a855f7" strokeOpacity="0.3" strokeWidth="2" />
            <line x1="15" y1="40" x2="85" y2="40" stroke="#a855f7" strokeOpacity="0.4" strokeWidth="1.5" />
            <circle cx="50" cy="30" r="7" fill="#a855f7" />
          </svg>
          <p className="mt-1 text-center text-[11px] font-semibold">1/30s · Pan</p>
          <p className="text-center text-[10px] text-muted-fg">Cyclist sharp, world rushing</p>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// HistogramZonesDiagram — labeled histogram
// ──────────────────────────────────────────────────────────────────────────
function HistogramZonesDiagram() {
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        Reading a histogram
      </figcaption>
      <div className="mx-auto max-w-lg">
        <svg viewBox="0 0 300 140" className="h-auto w-full">
          {/* Axes */}
          <line x1="20" y1="120" x2="290" y2="120" stroke="currentColor" strokeOpacity="0.3" />
          {/* Distribution */}
          <path
            d="M 20 120 Q 60 110 80 70 Q 120 30 155 35 Q 200 40 230 80 Q 260 110 290 120 Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
          {/* Zone labels */}
          <text x="35" y="135" textAnchor="middle" className="fill-current text-[10px]">shadows</text>
          <text x="100" y="135" textAnchor="middle" className="fill-current text-[10px]">dark mids</text>
          <text x="170" y="135" textAnchor="middle" className="fill-current text-[10px]">light mids</text>
          <text x="240" y="135" textAnchor="middle" className="fill-current text-[10px]">highlights</text>
          <text x="285" y="135" textAnchor="end" className="fill-current text-[10px]">clipped</text>

          {/* Danger zones */}
          <rect x="20" y="20" width="14" height="100" fill="#1e293b" fillOpacity="0.15" />
          <rect x="276" y="20" width="14" height="100" fill="#fef08a" fillOpacity="0.4" />
          <text x="27" y="14" textAnchor="middle" className="fill-current text-[9px] font-semibold">crushed</text>
          <text x="283" y="14" textAnchor="middle" className="fill-current text-[9px] font-semibold">blown</text>
        </svg>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-fg">
        Pixels stacked against either wall = lost detail. Aim for a peak in the middle.
      </p>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// FourQuestionsDiagram — 2x2 grid of the four pre-shot questions
// ──────────────────────────────────────────────────────────────────────────
function FourQuestionsDiagram() {
  const items = [
    { num: '1', q: 'What is my subject?', hint: 'Say it in one sentence.' },
    { num: '2', q: 'What is in the background?', hint: 'Backgrounds make or break.' },
    { num: '3', q: 'Where are my edges?', hint: 'Cropped clutter = a snag.' },
    { num: '4', q: 'What is the light doing?', hint: 'Quality, direction, colour.' },
  ];
  return (
    <>
      <figcaption className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-fg">
        Four questions before the shutter
      </figcaption>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.num} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-lg font-bold text-white">
              {it.num}
            </div>
            <div>
              <p className="font-semibold">{it.q}</p>
              <p className="mt-0.5 text-xs text-muted-fg">{it.hint}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
