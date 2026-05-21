'use client';

// Renders an inline image with a caption.
// If the image fails to load, falls back to a generated gradient placeholder
// with the caption shown inside — so lessons still look good before you've
// uploaded your photos.

import * as React from 'react';
import { ImageOff } from 'lucide-react';

// Deterministic gradient from a string — same input always produces the same gradient
function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  const palettes = [
    ['from-amber-400', 'via-orange-500', 'to-rose-500'],
    ['from-sky-400', 'via-blue-500', 'to-indigo-600'],
    ['from-emerald-400', 'via-teal-500', 'to-cyan-600'],
    ['from-purple-400', 'via-fuchsia-500', 'to-pink-500'],
    ['from-stone-400', 'via-stone-600', 'to-stone-800'],
    ['from-yellow-300', 'via-amber-500', 'to-orange-600'],
  ];
  return palettes[Math.abs(hash) % palettes.length];
}

export function LessonImage({
  src,
  caption,
  aspect = 'aspect-[3/2]',
}: {
  src: string;
  caption?: string;
  aspect?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const palette = gradientFor(src || caption || 'shutterly');

  return (
    <figure className="my-8">
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${palette.join(' ')} ${aspect}`}
      >
        {!failed && src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={caption || ''}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity"
          />
        )}
        {(failed || !src) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-white">
            <ImageOff className="h-6 w-6 opacity-70" />
            <p className="text-xs font-semibold uppercase tracking-widest opacity-90">Photo placeholder</p>
            {caption && <p className="max-w-md text-sm leading-snug opacity-95">{caption}</p>}
            {src && (
              <code className="mt-1 rounded bg-black/30 px-2 py-0.5 font-mono text-[10px] opacity-80">
                {src}
              </code>
            )}
          </div>
        )}
      </div>
      {caption && !failed && src && (
        <figcaption className="mt-2 text-center text-xs text-muted-fg">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
