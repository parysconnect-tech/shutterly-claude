'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Field } from '@/components/ui/Input';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // For launch: wire this to your SMTP / Resend / Fluent Forms endpoint.
    setSent(true);
    toast.success('Thanks — we read every message.');
  }

  return (
    <div className="container-narrow py-16 max-w-2xl">
      <h1 className="heading-display text-4xl">Contact</h1>
      <p className="mt-2 text-muted-fg">
        Questions, feedback, a photo to share? Mail <a className="text-brand-600 hover:underline" href="mailto:hello@shutterly.co.za">hello@shutterly.co.za</a> or use the form below.
      </p>
      {sent ? (
        <p className="mt-8 rounded-2xl border border-border bg-muted/40 p-6 text-sm">
          Message sent — we'll reply within a day or two.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Your name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </Field>
          <Field label="Message">
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6} />
          </Field>
          <Button type="submit">Send</Button>
        </form>
      )}
    </div>
  );
}
