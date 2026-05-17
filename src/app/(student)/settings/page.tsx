'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';

export default function SettingsPage() {
  const t = useTranslations();
  return (
    <div className="container-wide max-w-3xl mx-0 space-y-6">
      <h1 className="heading-display text-3xl">{t('nav.settings')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('common.theme')}</CardTitle>
          <CardDescription>Light, dark, or follow your system.</CardDescription>
        </CardHeader>
        <CardContent><ThemeToggle /></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('common.language')}</CardTitle>
          <CardDescription>{t('common.english')} or {t('common.afrikaans')}.</CardDescription>
        </CardHeader>
        <CardContent><LocaleSwitcher /></CardContent>
      </Card>
    </div>
  );
}
