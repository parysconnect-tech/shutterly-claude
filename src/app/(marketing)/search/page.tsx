'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Search } from 'lucide-react';
import { courses } from '@/content/curriculum';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export default function SearchPage() {
  const locale = (useLocale() as 'en' | 'af') ?? 'en';
  const [q, setQ] = React.useState('');

  const all = React.useMemo(
    () =>
      courses.flatMap((c) =>
        c.modules.flatMap((m) =>
          m.lessons.map((l) => ({
            title: l.title[locale],
            summary: l.summary[locale],
            href: `/learn/${c.slug}/${m.slug}/${l.slug}`
          }))
        )
      ),
    [locale]
  );

  const hits = q
    ? all.filter(
        (x) =>
          x.title.toLowerCase().includes(q.toLowerCase()) ||
          x.summary.toLowerCase().includes(q.toLowerCase())
      )
    : all.slice(0, 10);

  return (
    <div className="container-narrow py-16 max-w-3xl">
      <h1 className="heading-display text-4xl">Search</h1>
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-fg" />
        <Input
          autoFocus
          placeholder="aperture, golden hour, portfolio…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>
      <div className="mt-8 space-y-3">
        {hits.map((h) => (
          <Link key={h.href} href={h.href}>
            <Card className="hover:-translate-y-0.5 transition-transform">
              <CardContent className="pt-5">
                <p className="heading-display text-lg">{h.title}</p>
                <p className="mt-1 text-sm text-muted-fg line-clamp-2">{h.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {q && hits.length === 0 && (
          <p className="text-sm text-muted-fg">No matches. Try a wider word.</p>
        )}
      </div>
    </div>
  );
}
