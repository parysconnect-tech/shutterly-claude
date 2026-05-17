'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';

export default function SignUpPage() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', agree: false });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agree) return toast.error('Please accept the terms.');
    if (form.password.length < 8) return toast.error('Password needs 8+ characters.');
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Could not register.' }));
      setLoading(false);
      return toast.error(error);
    }
    await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false
    });
    setLoading(false);
    toast.success('Welcome to Shutterly.');
    router.push('/dashboard');
  }

  return (
    <div>
      <h1 className="heading-display text-3xl">{t('auth.signupTitle')}</h1>
      <p className="mt-2 text-sm text-muted-fg">
        {t('auth.haveAccount')}{' '}
        <Link className="text-brand-600 hover:underline" href="/signin">
          {t('nav.signin')}
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field label={t('auth.name')}>
          <Input
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label={t('auth.email')}>
          <Input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label={t('auth.password')} hint="Eight characters or more.">
          <Input
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <Checkbox
          label={t('auth.agreeTerms')}
          checked={form.agree}
          onChange={(e) => setForm({ ...form, agree: e.target.checked })}
        />
        <Button type="submit" className="w-full" loading={loading}>
          {t('nav.signup')}
        </Button>
      </form>
    </div>
  );
}
