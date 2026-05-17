import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

const SUPPORTED = ['en', 'af'] as const;
type Locale = (typeof SUPPORTED)[number];

function pickLocale(value?: string | null): Locale {
  if (!value) return 'en';
  const v = value.toLowerCase().slice(0, 2);
  return (SUPPORTED as readonly string[]).includes(v) ? (v as Locale) : 'en';
}

export default getRequestConfig(async () => {
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value;
  const headerLocale = headers().get('accept-language')?.split(',')[0];
  const locale = pickLocale(cookieLocale ?? headerLocale);
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
