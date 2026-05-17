'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Input';

export default function SignInPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      callbackUrl,
      redirect: false
    });
    setLoading(false);
    if (res?.error) {
      toast.error('Wrong email or password.');
    } else {
      toast.success('Signed in.');
      router.push(callbackUrl);
    }
  }

  return (
    <div>
      <h1 className="heading-display text-3xl">{t('auth.signinTitle')}</h1>
      <p className="mt-2 text-sm text-muted-fg">
        {t('auth.noAccount')}{' '}
        <Link className="text-brand-600 hover:underline" href="/signup">
          {t('nav.signup')}
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field label={t('auth.email')}>
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label={t('auth.password')}>
          <Input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <div className="flex justify-end">
          <Link href="/forgot" className="text-sm text-muted-fg hover:underline">
            {t('auth.forgot')}
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          {t('nav.signin')}
        </Button>
      </form>
    </div>
  );
}
