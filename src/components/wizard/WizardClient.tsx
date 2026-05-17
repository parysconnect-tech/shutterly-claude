'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  ChevronLeft, ChevronRight, Check, AlertTriangle, X, Sparkles, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Textarea, Field } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import type { WizardStep } from '@/content/wizard-steps';
import { cn } from '@/lib/utils';

type Payload = Record<string, any>;

export function WizardClient({
  steps,
  initialStep,
  initialPayload,
  completed
}: {
  steps: WizardStep[];
  initialStep: number;
  initialPayload: Payload;
  completed: boolean;
}) {
  const router = useRouter();
  const t = useTranslations('wizard');
  const [idx, setIdx] = React.useState(Math.min(initialStep, steps.length - 1));
  const [payload, setPayload] = React.useState<Payload>(initialPayload);
  const [checking, setChecking] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [results, setResults] = React.useState<Record<string, 'ok' | 'fail' | 'skip' | undefined>>({});

  const step = steps[idx];
  const totalRequired = steps.filter((s) => !s.optional).length;
  const doneRequired = Object.entries(results).filter(([slug, r]) => r === 'ok' && !steps.find((s) => s.slug === slug)?.optional).length;
  const percent = Math.round((idx / Math.max(1, steps.length - 1)) * 100);

  function setField(key: string, value: any) {
    setPayload((p) => ({ ...p, [step.slug]: { ...(p[step.slug] ?? {}), [key]: value } }));
  }

  async function save(next: number) {
    setSaving(true);
    const res = await fetch('/api/admin/wizard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentStep: next, payload, completed: next >= steps.length })
    });
    setSaving(false);
    if (!res.ok) { toast.error('Could not save progress.'); return false; }
    return true;
  }

  async function runCheck() {
    if (!step.checkEndpoint) return;
    setChecking(true);
    try {
      const res = await fetch(step.checkEndpoint, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      setResults((r) => ({ ...r, [step.slug]: res.ok ? 'ok' : 'fail' }));
      if (res.ok) toast.success(data.message ?? 'Looks good.');
      else toast.error(data.error ?? 'Check failed.');
    } finally {
      setChecking(false);
    }
  }

  async function nextStep() {
    const target = idx + 1;
    if (await save(target)) setIdx(target);
  }
  async function prevStep() {
    const target = Math.max(0, idx - 1);
    if (await save(target)) setIdx(target);
  }
  async function finish() {
    if (await save(steps.length)) {
      toast.success('Setup complete. Welcome to Shutterly.');
      router.push('/admin');
    }
  }
  async function dismiss() {
    await fetch('/api/admin/wizard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dismiss: true })
    });
    router.push('/admin');
  }

  return (
    <div className="container-wide max-w-5xl mx-0">
      {/* Top bar */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge tone="brand"><Sparkles className="h-3 w-3" /> {t('title')}</Badge>
          <h1 className="heading-display mt-2 text-3xl sm:text-4xl">{step.title}</h1>
          <p className="mt-1 text-muted-fg">{step.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-fg">
            {t('stepXofY', { x: idx + 1, y: steps.length })}
          </p>
          <p className="text-xs text-muted-fg">{t('percentComplete', { percent })}</p>
        </div>
      </div>
      <Progress className="mt-4" value={percent} />

      {/* Step body */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-[15px]">{step.intro}</p>
            {step.doc && (
              <details open className="rounded-xl border border-border bg-muted/40 p-4">
                <summary className="cursor-pointer text-sm font-medium">What this step does</summary>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
                  {step.doc}
                </pre>
              </details>
            )}
            {step.commands && (
              <div className="rounded-xl border border-border bg-foreground text-background p-4">
                <p className="text-xs uppercase tracking-wider opacity-70">Commands</p>
                <ul className="mt-2 space-y-2">
                  {step.commands.map((c) => (
                    <li key={c.cmd} className="flex items-center justify-between gap-2">
                      <code className="font-mono text-xs sm:text-sm">{c.cmd}</code>
                      <button
                        onClick={async () => { await navigator.clipboard.writeText(c.cmd); toast.success('Copied'); }}
                        className="rounded-full bg-background/15 px-2 py-1 text-xs hover:bg-background/25"
                      >
                        <Copy className="h-3 w-3 inline mr-1" /> Copy
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step.fields && (
              <div className="grid gap-3 sm:grid-cols-2">
                {step.fields.map((f) => {
                  const value = (payload[step.slug] ?? {})[f.key] ?? '';
                  if (f.kind === 'textarea') {
                    return (
                      <Field key={f.key} label={f.label} hint={f.hint}>
                        <Textarea value={value} onChange={(e) => setField(f.key, e.target.value)} />
                      </Field>
                    );
                  }
                  if (f.kind === 'select') {
                    return (
                      <Field key={f.key} label={f.label} hint={f.hint}>
                        <Select value={value} onChange={(e) => setField(f.key, e.target.value)}>
                          <option value="">— Choose —</option>
                          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </Select>
                      </Field>
                    );
                  }
                  if (f.kind === 'checkbox') {
                    return (
                      <div key={f.key} className="flex items-center sm:col-span-2 pt-4">
                        <Checkbox
                          label={f.label}
                          checked={!!value}
                          onChange={(e) => setField(f.key, e.target.checked)}
                        />
                      </div>
                    );
                  }
                  return (
                    <Field key={f.key} label={f.label} hint={f.hint}>
                      <Input
                        type={f.kind === 'email' ? 'email' : f.kind === 'password' ? 'password' : f.kind === 'number' ? 'number' : 'text'}
                        value={value}
                        placeholder={f.placeholder}
                        onChange={(e) => setField(f.key, e.target.value)}
                      />
                    </Field>
                  );
                })}
              </div>
            )}
            {step.checkEndpoint && (
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={runCheck} loading={checking}>
                  Run check
                </Button>
                {results[step.slug] === 'ok' && <Badge tone="success"><Check className="h-3 w-3" /> Passed</Badge>}
                {results[step.slug] === 'fail' && <Badge tone="danger"><AlertTriangle className="h-3 w-3" /> Issue found</Badge>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mini step list */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wider text-muted-fg">All steps</p>
            <ol className="mt-2 space-y-1 text-sm max-h-[60vh] overflow-y-auto pr-1">
              {steps.map((s, i) => (
                <li key={s.slug}>
                  <button
                    onClick={() => save(i).then((ok) => ok && setIdx(i))}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1 text-left',
                      i === idx ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200' : 'hover:bg-muted'
                    )}
                  >
                    <span className="line-clamp-1">
                      <span className="font-mono text-[10px] text-muted-fg mr-2">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.title}
                    </span>
                    {s.optional && <span className="text-[10px] text-muted-fg">optional</span>}
                  </button>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={dismiss}>
          <X className="h-4 w-4" /> {t('buttons.dismiss')}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep} disabled={idx === 0 || saving}>
            <ChevronLeft className="h-4 w-4" /> {t('buttons.prev')}
          </Button>
          {idx < steps.length - 1 ? (
            <Button onClick={nextStep} loading={saving}>
              {t('buttons.next')} <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finish} loading={saving}>
              <Check className="h-4 w-4" /> {t('buttons.finish')}
            </Button>
          )}
        </div>
      </div>

      {doneRequired < totalRequired && idx >= steps.length - 1 && (
        <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-100/40 dark:bg-amber-900/30 p-4 text-sm">
          <p className="font-medium flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4" /> {t('warnIncomplete')}
          </p>
        </div>
      )}
    </div>
  );
}
