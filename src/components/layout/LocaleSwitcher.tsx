'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('common');

  function setLocale(next: string) {
    document.cookie = `NEXT_LOCALE=${next}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-1 py-1">
      <Globe className="ml-2 h-3.5 w-3.5 text-muted-fg" aria-hidden />
      {(['en', 'af'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-medium transition',
            locale === l ? 'bg-card text-foreground shadow-soft' : 'text-muted-fg hover:text-foreground'
          )}
          aria-label={l === 'en' ? t('english') : t('afrikaans')}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
