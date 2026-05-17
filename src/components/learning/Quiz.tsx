'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuizSpec } from '@/content/curriculum';

export function Quiz({ spec, onPass }: { spec: QuizSpec; onPass?: () => void }) {
  const locale = (useLocale() as 'en' | 'af') ?? 'en';
  const t = useTranslations('lesson');
  const [answers, setAnswers] = React.useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const correct = spec.questions.reduce((acc, q, i) => {
    const ans = answers[i];
    if (ans == null) return acc;
    return q.options[ans]?.correct ? acc + 1 : acc;
  }, 0);
  const score = Math.round((correct / spec.questions.length) * 100);
  const passed = score >= spec.passScore;

  React.useEffect(() => {
    if (submitted && passed) onPass?.();
  }, [submitted, passed, onPass]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quiz')}</CardTitle>
        <CardDescription>
          Pass at {spec.passScore}% or better to mark this lesson complete.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {spec.questions.map((q, qi) => (
          <div key={qi}>
            <p className="font-medium">
              {qi + 1}. {q.prompt[locale]}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const picked = answers[qi] === oi;
                const correctOpt = opt.correct;
                const reveal = submitted;
                return (
                  <button
                    key={oi}
                    onClick={() => !submitted && setAnswers({ ...answers, [qi]: oi })}
                    className={cn(
                      'flex items-start gap-2 rounded-xl border p-3 text-left text-sm transition',
                      picked && !submitted && 'border-brand-500 bg-brand-100/50 dark:bg-brand-900/30',
                      reveal && correctOpt && 'border-success bg-success/10 text-success',
                      reveal && picked && !correctOpt && 'border-danger bg-danger/10 text-danger',
                      !picked && !reveal && 'border-border hover:bg-muted'
                    )}
                  >
                    {reveal && correctOpt ? (
                      <Check className="h-4 w-4 shrink-0" />
                    ) : reveal && picked && !correctOpt ? (
                      <X className="h-4 w-4 shrink-0" />
                    ) : (
                      <span className="mt-0.5 h-3.5 w-3.5 rounded-full border border-border shrink-0" />
                    )}
                    {opt.label[locale]}
                  </button>
                );
              })}
            </div>
            {submitted && q.explain && (
              <p className="mt-2 text-xs text-muted-fg">{q.explain[locale]}</p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between gap-3 pt-2">
          {submitted ? (
            <Badge tone={passed ? 'success' : 'danger'}>
              {passed ? t('correct') : t('incorrect')} — {score}%
            </Badge>
          ) : (
            <span className="text-sm text-muted-fg">
              Answered {Object.values(answers).filter((v) => v != null).length} / {spec.questions.length}
            </span>
          )}
          {!submitted ? (
            <Button onClick={() => setSubmitted(true)}>Submit answers</Button>
          ) : (
            <Button variant="outline" onClick={() => { setSubmitted(false); setAnswers({}); }}>
              Try again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
