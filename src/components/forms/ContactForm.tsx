'use client';

/**
 * ContactForm — lead capture form used on /contact, /request-website and
 * the homepage contact section. Posts to /api/leads with honeypot.
 */
import { useState, type FormEvent } from 'react';
import { MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea, Select } from '@/components/ui/Form';
import { whatsappLink } from '@/config/site';
import { track } from '@/lib/analytics';

export type LeadSource = 'contact' | 'request-website' | 'calculator';

const projectTypes = [
  'Business Website',
  'E-commerce Website',
  'Landing Page',
  'Portfolio',
  'Web Application',
  'Admin Dashboard',
  'Website Redesign',
  'API / Backend',
  'Maintenance / Support',
  'Other',
];

const budgets = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
  'Not sure yet',
];

export function ContactForm({
  source = 'contact',
  defaultProjectType,
  defaultBudget,
  defaultMessage,
  compact = false,
}: {
  source?: LeadSource;
  defaultProjectType?: string;
  defaultBudget?: string;
  defaultMessage?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      businessName: String(form.get('businessName') ?? ''),
      website: String(form.get('website') ?? ''),
      projectType: String(form.get('projectType') ?? ''),
      budget: String(form.get('budget') ?? ''),
      message: String(form.get('message') ?? ''),
      company: String(form.get('company') ?? ''), // honeypot
      source,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }
      setStatus('success');
      track(source === 'request-website' ? 'request_website_submitted' : 'contact_form_submitted', {
        source,
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div
        className="card flex flex-col items-center gap-4 p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="text-success" size={40} aria-hidden />
        <div>
          <h3 className="font-display text-xl font-bold">Message sent</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks for reaching out — I will get back to you within one business day. For a faster
            reply, continue on WhatsApp.
          </p>
        </div>
        <Button href={whatsappLink()} variant="whatsapp" target="_blank">
          <MessageCircle size={16} aria-hidden /> Continue on WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* honeypot — hidden from humans */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={compact ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2'}>
        <Field label="Name" htmlFor="name" required>
          <Input id="name" name="name" required autoComplete="name" maxLength={120} placeholder="Your name" />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            placeholder="you@company.com"
          />
        </Field>
      </div>

      <div className={compact ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2'}>
        <Field label="Phone" htmlFor="phone" hint="Include country code for WhatsApp replies">
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder="+91 98765 43210"
          />
        </Field>
        <Field label="Business name" htmlFor="businessName">
          <Input id="businessName" name="businessName" autoComplete="organization" maxLength={200} placeholder="Company / brand" />
        </Field>
      </div>

      <div className={compact ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2'}>
        <Field label="Website (optional)" htmlFor="website">
          <Input id="website" name="website" type="url" maxLength={300} placeholder="https://…" />
        </Field>
        <Field label="Project type" htmlFor="projectType">
          <Select id="projectType" name="projectType" defaultValue={defaultProjectType ?? ''}>
            <option value="">Select a project type</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Budget" htmlFor="budget">
        <Select id="budget" name="budget" defaultValue={defaultBudget ?? ''}>
          <option value="">Select a budget range</option>
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Message" htmlFor="message" required hint="Describe your project, goals and timeline">
        <Textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          defaultValue={defaultMessage}
          placeholder="I need a website for my business…"
        />
      </Field>

      {status === 'error' && (
        <div
          className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send Message'}
          <Send size={16} aria-hidden />
        </Button>
        <Button
          href={whatsappLink()}
          variant="whatsapp"
          size="lg"
          target="_blank"
          onClick={() => track('whatsapp_clicked', { location: 'contact_form' })}
        >
          <MessageCircle size={16} aria-hidden /> Chat on WhatsApp
        </Button>
      </div>
    </form>
  );
}
