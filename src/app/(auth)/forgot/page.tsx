'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Input';

export default function ForgotPage() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setLoading(false);
    setSent(true);
    toast.success(t('auth.checkInbox'));
  }

  return (
    <div>
      <h1 className="heading-display text-3xl">{t('auth.forgotTitle')}</h1>
      <p className="mt-2 text-sm text-muted-fg">
        <Link className="text-brand-600 hover:underline" href="/signin">
          ← {t('nav.signin')}
        </Link>
      </p>
      {sent ? (
        <p className="mt-8 rounded-2xl border border-border bg-muted/50 p-6 text-sm">
          {t('auth.checkInbox')}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label={t('auth.email')}>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Button type="submit" loading={loading} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </div>
  );
}
