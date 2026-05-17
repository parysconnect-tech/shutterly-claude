'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea, Field } from '@/components/ui/Input';

export function ChallengeUpload({ challengeSlug }: { challengeSlug: string }) {
  const t = useTranslations('challenges');
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [caption, setCaption] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return toast.error('Pick a photo first.');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const up = await fetch('/api/uploads', { method: 'POST', body: fd });
      if (!up.ok) throw new Error((await up.json()).error ?? 'Upload failed.');
      const { media } = await up.json();
      const submit = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeSlug, mediaId: media.id, caption })
      });
      if (!submit.ok) throw new Error((await submit.json()).error ?? 'Submit failed.');
      setDone(true);
      toast.success(t('submitted'));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-4 rounded-2xl border border-success/40 bg-success/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
        <p className="mt-2 heading-display text-lg">{t('submitted')}</p>
        <p className="mt-1 text-sm text-muted-fg">Head to the gallery to see other photographers' work.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative aspect-[4/3] cursor-pointer rounded-2xl border-2 border-dashed border-border bg-muted/40 transition hover:bg-muted overflow-hidden"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-fg">
            <UploadCloud className="h-8 w-8" />
            <p className="text-sm font-medium">Click or drop a photo here</p>
            <p className="text-xs">JPG · PNG · WebP</p>
          </div>
        )}
        {file && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFile(null); }}
            className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-foreground/80 p-1.5 text-white"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <Field label={t('captionLabel')}>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="The story behind the frame…"
          rows={3}
        />
      </Field>
      <Button type="submit" loading={loading} className="w-full">
        <ImageIcon className="h-4 w-4" /> {t('submit')}
      </Button>
    </form>
  );
}
