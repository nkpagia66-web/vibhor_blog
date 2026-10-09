'use client';

/**
 * PricingManager — edit pricing plans via /api/admin/pricing.
 * Shows DB plans when present, otherwise the current config values (which
 * get upserted into the DB on first save).
 */
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X } from 'lucide-react';
import { Field, Input, Textarea, Select } from '@/components/ui/Form';
import { Badge } from '@/components/ui/Layout';
import type { PricingPlan } from '@/config/pricing';

type DbPlan = {
  id: string;
  slug: string;
  name: string;
  price: number;
  monthlyPrice: number | null;
  billingType: string;
  description: string;
  audience: string;
  features: string[];
  recommended: boolean;
  ctaText: string;
  active: boolean;
  sortOrder: number;
};

type Draft = {
  id?: string;
  slug: string;
  name: string;
  price: number;
  monthlyPrice: number;
  billingType: string;
  description: string;
  audience: string;
  features: string; // one per line
  recommended: boolean;
  ctaText: string;
  active: boolean;
  sortOrder: number;
};

function toDraft(p: {
  id?: string;
  slug: string;
  name: string;
  price: number;
  monthlyPrice?: number | null;
  billingType: string;
  description: string;
  audience?: string;
  features?: string[];
  recommended?: boolean;
  ctaText?: string;
  active?: boolean;
  sortOrder?: number;
}): Draft {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    monthlyPrice: p.monthlyPrice ?? 0,
    billingType: p.billingType,
    description: p.description,
    audience: p.audience ?? '',
    features: (p.features ?? []).join('\n'),
    recommended: p.recommended ?? false,
    ctaText: p.ctaText ?? 'Get My Website',
    active: p.active ?? true,
    sortOrder: p.sortOrder ?? 0,
  };
}

export function PricingManager({
  dbOk,
  dbPlans,
  fallbackPlans,
}: {
  dbOk: boolean;
  dbPlans: DbPlan[];
  fallbackPlans: PricingPlan[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // merge: DB wins by slug, config plans appended
  const merged: (DbPlan | PricingPlan)[] = (() => {
    const bySlug = new Map(dbPlans.map((p) => [p.slug, p as DbPlan | PricingPlan]));
    const out: (DbPlan | PricingPlan)[] = [...dbPlans];
    for (const p of fallbackPlans) if (!bySlug.has(p.slug)) out.push(p);
    return out.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  })();

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError('');
    try {
      const payload = {
        slug: draft.slug,
        name: draft.name,
        price: Number(draft.price) || 0,
        monthlyPrice: draft.billingType === 'one_time_plus_monthly' ? Number(draft.monthlyPrice) || 0 : null,
        billingType: draft.billingType,
        description: draft.description,
        audience: draft.audience,
        features: draft.features.split('\n').map((f) => f.trim()).filter(Boolean),
        recommended: draft.recommended,
        ctaText: draft.ctaText,
        active: draft.active,
        sortOrder: Number(draft.sortOrder) || 0,
      };
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Could not save plan.');
      setDraft(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save plan.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        {merged.map((plan) => {
          const dbPlan = 'id' in plan ? (plan as DbPlan) : null;
          return (
            <div key={plan.slug} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold">{plan.name}</h2>
                    <Badge tone="accent">{plan.slug}</Badge>
                    {!plan.active && <Badge tone="danger">Inactive</Badge>}
                    {plan.recommended && <Badge tone="warning">Recommended</Badge>}
                    {!dbPlan && <Badge>Config default</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  <p className="mt-2 text-sm font-semibold tabular-nums">
                    {plan.billingType === 'custom'
                      ? "Let's discuss"
                      : `₹${plan.price.toLocaleString('en-IN')}`}
                    {plan.monthlyPrice ? ` + ₹${plan.monthlyPrice.toLocaleString('en-IN')}/month` : ''}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.features.length} features listed
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!dbOk}
                  onClick={() => setDraft(toDraft(plan as Parameters<typeof toDraft>[0]))}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
                >
                  <Pencil size={13} aria-hidden /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* editor */}
      {draft && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit pricing plan"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-card sm:rounded-3xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Edit plan: {draft.name}</h2>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-lg p-1.5 hover:bg-muted"
                aria-label="Close editor"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Plan name" htmlFor="pr-name" required>
                  <Input id="pr-name" required value={draft.name} onChange={(e) => set('name', e.target.value)} />
                </Field>
                <Field label="Billing type" htmlFor="pr-billing">
                  <Select id="pr-billing" value={draft.billingType} onChange={(e) => set('billingType', e.target.value)}>
                    <option value="one_time">One-time</option>
                    <option value="one_time_plus_monthly">One-time + monthly</option>
                    <option value="custom">Custom (discuss)</option>
                  </Select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="One-time price (₹)" htmlFor="pr-price">
                  <Input
                    id="pr-price"
                    type="number"
                    min={0}
                    value={draft.price}
                    onChange={(e) => set('price', Number(e.target.value))}
                    disabled={draft.billingType === 'custom'}
                  />
                </Field>
                <Field label="Monthly price (₹)" htmlFor="pr-monthly" hint="0 if none">
                  <Input
                    id="pr-monthly"
                    type="number"
                    min={0}
                    value={draft.monthlyPrice}
                    onChange={(e) => set('monthlyPrice', Number(e.target.value))}
                    disabled={draft.billingType !== 'one_time_plus_monthly'}
                  />
                </Field>
              </div>

              <Field label="Description" htmlFor="pr-desc" required>
                <Textarea id="pr-desc" rows={2} required value={draft.description} onChange={(e) => set('description', e.target.value)} />
              </Field>

              <Field label="Audience line" htmlFor="pr-audience">
                <Input id="pr-audience" value={draft.audience} onChange={(e) => set('audience', e.target.value)} />
              </Field>

              <Field label="Features" htmlFor="pr-features" hint="One per line">
                <Textarea
                  id="pr-features"
                  rows={8}
                  value={draft.features}
                  onChange={(e) => set('features', e.target.value)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="CTA text" htmlFor="pr-cta">
                  <Input id="pr-cta" value={draft.ctaText} onChange={(e) => set('ctaText', e.target.value)} />
                </Field>
                <Field label="Sort order" htmlFor="pr-sort">
                  <Input
                    id="pr-sort"
                    type="number"
                    min={0}
                    value={draft.sortOrder}
                    onChange={(e) => set('sortOrder', Number(e.target.value))}
                  />
                </Field>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.recommended}
                    onChange={(e) => set('recommended', e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--accent))]"
                  />
                  Recommended
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) => set('active', e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--accent))]"
                  />
                  Active (visible on site)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? 'Saving…' : 'Save plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
