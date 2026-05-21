'use client';

// Hero image at the top of each lesson.
// If `src` resolves, shows the image with a subtle bottom gradient + caption.
// If `src` is missing or 404s, shows a deterministic abstract gradient based on `seed`
// so every lesson still has a unique visual identity.

import * as React from 'react';
import { Camera } from 'lucide-react';

function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  const palettes = [
    // Cape sunrise
    { stops: ['#fbbf24', '#f97316', '#9a3412'], shape: 'circle' },
    // Karoo dusk
    { stops: ['#fde68a', '#f59e0b', '#7c2d12'], shape: 'diag' },
    // Storms River
    { stops: ['#a7f3d0', '#0d9488', '#0c4a6e'], shape: 'circle' },
    // Drakensberg
    { stops: ['#cbd5e1', '#475569', '#1e293b'], shape: 'diag' },
    // Highveld storm
    { stops: ['#fef3c7', '#94a3b8', '#1e3a8a'], shape: 'circle' },
    // Camps Bay sunset
    { stops: ['#fda4af', '#fb7185', '#831843'], shape: 'diag' },
    // Kalahari noon
    { stops: ['#fed7aa', '#ea580c', '#7c2d12'], shape: 'circle' },
    // Cape winelands
    { stops: ['#bbf7d0', '#84cc16', '#365314'], shape: 'diag' },
  ];
  return palettes[Math.abs(hash) % palettes.length];
}

export function LessonHero({
  src,
  caption,
  seed,
  title,
}: {
  src?: string;
  caption?: string;
  seed: string;
  title: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const palette = gradientFor(seed);
  const showImage = !!src && !failed;

  return (
    <div className="relative mt-6 overflow-hidden rounded-3xl shadow-soft">
      <div
        className="relative aspect-[16/7] w-full"
        style={
          !showImage
            ? {
                background:
                  palette.shape === 'circle'
                    ? `radial-gradient(circle at 30% 30%, ${palette.stops[0]}, ${palette.stops[1]} 45%, ${palette.stops[2]})`
                    : `linear-gradient(135deg, ${palette.stops[0]}, ${palette.stops[1]} 50%, ${palette.stops[2]})`,
              }
            : undefined
        }
      >
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={caption || title}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {!showImage && (
          <div className="absolute inset-0 flex items-end p-6 sm:p-8">
            <div className="flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              <Camera className="h-3.5 w-3.5" />
              <span>Hero photo placeholder</span>
            </div>
          </div>
        )}
        {/* Gradient overlay for legibility of caption */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        {caption && (
          <p className="absolute inset-x-0 bottom-0 p-4 text-center text-xs italic text-white/90 sm:p-6 sm:text-sm">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
