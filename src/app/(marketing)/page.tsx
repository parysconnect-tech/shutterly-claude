import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import {
  Camera,
  Sparkles,
  Globe2,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { courses } from '@/content/curriculum';

export default async function HomePage() {
  const t = await getTranslations();
  const locale = (await getLocale()) as 'en' | 'af';
  const course = courses[0];

  const features = [
    { icon: Sparkles, t: 'feature1' },
    { icon: Camera, t: 'feature2' },
    { icon: Globe2, t: 'feature3' },
    { icon: Trophy, t: 'feature4' }
  ] as const;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[40rem] bg-[radial-gradient(circle_at_center,_hsl(var(--ring)/0.25),_transparent_60%)]" />
        <div className="container-wide grid items-center gap-12 py-16 sm:py-24 md:grid-cols-2">
          <div>
            <Badge tone="brand" className="mb-4">
              <Sparkles className="h-3 w-3" /> {t('common.freeForever')}
            </Badge>
            <h1 className="heading-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              {t('brand.tagline')}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-fg">{t('brand.blurb')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/signup">
                  {t('marketing.heroCtaPrimary')} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/courses/${course.slug}`}>{t('marketing.heroCtaSecondary')}</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-fg">{t('marketing.trustline')}</p>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-fg">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 8 modules</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 30+ lessons</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Weekly briefs</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> EN / AF</span>
            </div>
          </div>

          {/* Hero visual: stacked photo cards */}
          <div className="relative h-[420px] md:h-[520px]">
            {[
              { src: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=70', rotate: '-6deg', x: '10%', y: '4%', z: 30 },
              { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=70', rotate: '4deg', x: '45%', y: '12%', z: 20 },
              { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=70', rotate: '-2deg', x: '20%', y: '40%', z: 10 }
            ].map((p, i) => (
              <div
                key={i}
                className="absolute h-64 w-48 sm:h-72 sm:w-56 overflow-hidden rounded-3xl border border-border shadow-soft bg-card animate-float"
                style={{
                  left: p.x,
                  top: p.y,
                  transform: `rotate(${p.rotate})`,
                  zIndex: p.z,
                  animationDelay: `${i * 0.6}s`
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="Photography example" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-3 text-[10px] uppercase tracking-wider text-white">
                  Lesson {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-border bg-muted/40 py-20">
        <div className="container-wide">
          <h2 className="heading-display text-3xl sm:text-4xl">{t('marketing.featureTitle')}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, t: key }, i) => (
              <Card key={i} className="hover:-translate-y-1 transition-transform">
                <CardContent className="pt-6">
                  <Icon className="h-6 w-6 text-brand-500" />
                  <h3 className="heading-display mt-3 text-lg">
                    {t(`marketing.${key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-fg">{t(`marketing.${key}Body`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="container-wide py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="heading-display text-3xl sm:text-4xl">{t('marketing.modulesTitle')}</h2>
            <p className="mt-3 max-w-xl text-muted-fg">{t('marketing.modulesSubtitle')}</p>
          </div>
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <Link href={`/courses/${course.slug}`}>
              View the full curriculum <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {course.modules.map((m, i) => (
            <Card key={m.slug} className="group relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600 opacity-70" />
              <CardContent className="pt-6">
                <Badge tone="brand">{String(i + 1).padStart(2, '0')}</Badge>
                <h3 className="heading-display mt-3 text-lg leading-tight">
                  {m.title[locale]}
                </h3>
                <p className="mt-2 text-sm text-muted-fg line-clamp-3">{m.summary[locale]}</p>
                <p className="mt-4 text-xs text-muted-fg">{m.lessons.length} lessons</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-y border-border bg-muted/40">
        <div className="container-wide py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Quote className="h-8 w-8 text-brand-500" />
            <p className="heading-display mt-3 text-2xl sm:text-3xl leading-tight">
              “I’ve done six photography courses before. Shutterly is the first that taught me to <em className="text-brand-600 dark:text-brand-300">see</em> instead of to <em>set</em>.”
            </p>
            <p className="mt-4 text-sm text-muted-fg">— Tumi N., wedding photographer, Pretoria</p>
          </div>
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="heading-display text-xl">What's inside</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {[
                    'Interactive exposure, aperture, shutter and ISO simulators',
                    'Before/after editing comparisons on every editing lesson',
                    'A weekly photo challenge with a student gallery',
                    'Bilingual lessons (English + Afrikaans), side by side',
                    'Mobile-friendly, light + dark mode, offline-friendly resources',
                    'Plugs into your WordPress site via a free bridge plugin'
                  ].map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-wide py-24 text-center">
        <h2 className="heading-display mx-auto max-w-2xl text-4xl sm:text-5xl">
          {t('marketing.finalCtaTitle')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-fg">
          {t('marketing.finalCtaBody')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/signup">
              {t('marketing.heroCtaPrimary')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={`/courses/${course.slug}`}>{t('marketing.heroCtaSecondary')}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
