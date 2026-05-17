import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { Instagram, Youtube, Github, Mail } from 'lucide-react';

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container-wide py-14 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-fg">{t('brand.blurb')}</p>
          <div className="mt-5 flex gap-2 text-muted-fg">
            <a aria-label="Instagram" href="#" className="rounded-full p-2 hover:bg-card hover:text-foreground">
              <Instagram className="h-4 w-4" />
            </a>
            <a aria-label="YouTube" href="#" className="rounded-full p-2 hover:bg-card hover:text-foreground">
              <Youtube className="h-4 w-4" />
            </a>
            <a aria-label="GitHub" href="#" className="rounded-full p-2 hover:bg-card hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
            <a aria-label="Email" href="mailto:hello@shutterly.co.za" className="rounded-full p-2 hover:bg-card hover:text-foreground">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg">Learn</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-brand-600" href="/courses">{t('nav.courses')}</Link></li>
            <li><Link className="hover:text-brand-600" href="/challenges">{t('nav.challenges')}</Link></li>
            <li><Link className="hover:text-brand-600" href="/gallery">{t('nav.gallery')}</Link></li>
            <li><Link className="hover:text-brand-600" href="/dashboard">{t('nav.dashboard')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg">About</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-brand-600" href="/about">About Shutterly</Link></li>
            <li><Link className="hover:text-brand-600" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-brand-600" href="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-brand-600" href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-wide flex flex-col sm:flex-row gap-2 items-center justify-between py-5 text-xs text-muted-fg">
          <p>© {new Date().getFullYear()} Shutterly · Made in South Africa with care.</p>
          <p>{t('common.freeForever')}.</p>
        </div>
      </div>
    </footer>
  );
}
