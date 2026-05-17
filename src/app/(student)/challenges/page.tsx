import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { challenges } from '@/content/curriculum';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Camera, ArrowRight } from 'lucide-react';

export default async function ChallengesIndex() {
  const t = await getTranslations();
  const locale = (await getLocale()) as 'en' | 'af';
  return (
    <div className="container-wide max-w-5xl mx-0">
      <h1 className="heading-display text-3xl sm:text-4xl">{t('challenges.title')}</h1>
      <p className="mt-2 text-muted-fg">{t('challenges.subtitle')}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {challenges.map((c) => (
          <Card key={c.slug} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Badge tone={c.cadence === 'featured' ? 'accent' : 'brand'}>
                  {c.cadence}
                </Badge>
                <span className="text-xs text-muted-fg inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {c.daysOpen} days open
                </span>
              </div>
              <h2 className="heading-display mt-3 text-xl">{c.title[locale]}</h2>
              <p className="mt-2 text-sm text-muted-fg">{c.brief[locale]}</p>
              <Link
                href={`/challenges/${c.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
              >
                {t('challenges.viewBrief')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
