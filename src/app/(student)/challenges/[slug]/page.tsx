import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { challenges } from '@/content/curriculum';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar } from 'lucide-react';
import { ChallengeUpload } from '@/components/challenges/ChallengeUpload';

export default async function ChallengeDetail({ params }: { params: { slug: string } }) {
  const c = challenges.find((x) => x.slug === params.slug);
  if (!c) notFound();
  const t = await getTranslations();
  const locale = (await getLocale()) as 'en' | 'af';

  return (
    <div className="container-wide max-w-3xl mx-0">
      <Badge tone="accent">{c.cadence}</Badge>
      <h1 className="heading-display mt-3 text-3xl sm:text-4xl">{c.title[locale]}</h1>
      <p className="mt-3 text-muted-fg">{c.brief[locale]}</p>
      <p className="mt-2 text-xs text-muted-fg inline-flex items-center gap-1">
        <Calendar className="h-3 w-3" /> {t('challenges.deadline')} in {c.daysOpen} days
      </p>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <h2 className="heading-display text-xl">{t('challenges.submit')}</h2>
          <p className="mt-1 text-sm text-muted-fg">
            {t('challenges.uploadHint', { max: process.env.UPLOAD_MAX_MB ?? '20' })}
          </p>
          <ChallengeUpload challengeSlug={c.slug} />
        </CardContent>
      </Card>
    </div>
  );
}
