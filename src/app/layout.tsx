import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';

import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { SuperadminLauncher } from '@/components/admin/SuperadminLauncher';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'
});

export const metadata: Metadata = {
  title: { default: 'Shutterly — Photography, the South African way.', template: '%s · Shutterly' },
  description:
    'A free, modern photography learning platform with story-first lessons, interactive simulators, weekly challenges and a South African heart.',
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Shutterly',
    description: 'Photography, the South African way.',
    type: 'website',
    locale: 'en_ZA'
  },
  icons: { icon: '/favicon.svg' }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff8eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1117' }
  ],
  width: 'device-width',
  initialScale: 1
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
              {children}
              <PageViewTracker />
              <SuperadminLauncher />
              <Toaster position="top-right" richColors closeButton />
            </SessionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
