'use client';

/**
 * QuoteCalculator — interactive "Build Your Website" estimator.
 * All pricing rules come from src/config/calculator.ts (single source of
 * truth). Results are estimates, never binding quotes — the disclaimer is
 * always visible.
 */
import { useMemo, useState, useEffect } from 'react';
import { Calculator, Check, MessageCircle, ArrowRight, Info } from 'lucide-react';
import { calculatorConfig, calculateEstimate } from '@/config/calculator';
import { formatINR } from '@/config/pricing';
import { whatsappLink } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { Field, Select } from '@/components/ui/Form';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function QuoteCalculator({ id }: { id?: string }) {
  const [websiteType, setWebsiteType] = useState(calculatorConfig.websiteTypes[1].id);
  const [pages, setPages] = useState<number>(calculatorConfig.pages.default);
  const [features, setFeatures] = useState<string[]>(
    calculatorConfig.features.filter((f) => f.free).map((f) => f.id),
  );
  const [support, setSupport] = useState(calculatorConfig.support[0].id);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) track('quote_calculator_used', { websiteType, pages, features: features.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteType, pages, features, support]);

  const result = useMemo(
    () => calculateEstimate({ websiteType, pages, features, support }),
    [websiteType, pages, features, support],
  );

  function toggleFeature(id: string) {
    setTouched(true);
    setFeatures((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  const summaryLines = [
    `${calculatorConfig.websiteTypes.find((t) => t.id === websiteType)?.label}`,
    `${pages} page${pages > 1 ? 's' : ''}`,
    `${features.length} feature${features.length !== 1 ? 's' : ''}`,
    calculatorConfig.support.find((s) => s.id === support)?.label,
  ].join(' · ');

  const waMessage = `Hi Vibhor, I used your website calculator and got an estimate.

Project: ${summaryLines}
Estimated one-time price: ${formatINR(result.oneTimeTotal)}${
    result.monthlyTotal > 0 ? `\nMonthly support: ${formatINR(result.monthlyTotal)}/month` : ''
  }
Estimated timeline: ${result.timeline}

I'd like to discuss my requirements.`;

  return (
    <div
      id={id}
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-card"
    >
      <div className="grid lg:grid-cols-5">
        {/* -------- inputs -------- */}
        <div className="space-y-6 border-b border-border p-6 sm:p-8 lg:col-span-3 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Calculator size={20} aria-hidden />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight">Build your website</h3>
              <p className="text-sm text-muted-foreground">Get an instant estimate in under a minute.</p>
            </div>
          </div>

          {/* website type */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">1. What do you need?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {calculatorConfig.websiteTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setWebsiteType(type.id);
                    setTouched(true);
                  }}
                  aria-pressed={websiteType === type.id}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all',
                    websiteType === type.id
                      ? 'border-accent bg-accent-soft shadow-glow'
                      : 'border-border bg-background hover:border-accent/40',
                  )}
                >
                  <span className="block text-sm font-semibold">{type.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{type.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* pages */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">2. Number of pages</legend>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={calculatorConfig.pages.min}
                max={calculatorConfig.pages.max}
                value={pages}
                onChange={(e) => {
                  setPages(Number(e.target.value));
                  setTouched(true);
                }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[rgb(var(--accent))]"
                aria-label="Number of pages"
                aria-valuetext={`${pages} pages`}
              />
              <span className="min-w-16 rounded-lg border border-border bg-background px-3 py-1.5 text-center text-sm font-bold tabular-nums">
                {pages}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {calculatorConfig.pages.included} pages included in the base price; extra pages are{' '}
              {formatINR(calculatorConfig.pages.pricePerPage)} each.
            </p>
          </fieldset>

          {/* features */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">3. Features</legend>
            <div className="flex flex-wrap gap-2">
              {calculatorConfig.features.map((feature) => {
                const selected = features.includes(feature.id);
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => toggleFeature(feature.id)}
                    aria-pressed={selected}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                      selected
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-foreground',
                    )}
                  >
                    {selected && <Check size={12} aria-hidden />}
                    {feature.label}
                    {!feature.free && (
                      <span className={cn('tabular-nums', selected ? 'opacity-80' : 'opacity-70')}>
                        +{formatINR(feature.price)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* support */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">4. Support after launch</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {calculatorConfig.support.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSupport(option.id);
                    setTouched(true);
                  }}
                  aria-pressed={support === option.id}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all',
                    support === option.id
                      ? 'border-accent bg-accent-soft'
                      : 'border-border bg-background hover:border-accent/40',
                  )}
                >
                  <span className="block text-sm font-semibold">{option.label}</span>
                  <span className="mt-0.5 block text-xs tabular-nums text-accent">
                    {option.monthlyPrice > 0 ? `${formatINR(option.monthlyPrice)}/month` : 'No monthly cost'}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* -------- result -------- */}
        <div className="flex flex-col gap-5 bg-muted/40 p-6 sm:p-8 lg:col-span-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estimated project price
            </p>
            <p className="mt-2 font-display text-4xl font-bold tracking-tight tabular-nums text-accent sm:text-5xl">
              {formatINR(result.oneTimeTotal)}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">one-time development</p>
            {result.monthlyTotal > 0 && (
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                + {formatINR(result.monthlyTotal)}/month support
              </p>
            )}
          </div>

          <div className="space-y-1.5 rounded-xl border border-border bg-card p-4 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Breakdown
            </p>
            {result.breakdown.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium tabular-nums">{formatINR(row.amount)}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-2 font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatINR(result.oneTimeTotal)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card text-accent">
              <Info size={15} aria-hidden />
            </span>
            Typical timeline: <strong className="font-semibold text-foreground">{result.timeline}</strong>
          </div>

          <div className="mt-auto flex flex-col gap-2.5">
            <Button
              href="/request-website?from=calculator"
              size="lg"
              onClick={() => track('pricing_cta_clicked', { location: 'calculator' })}
            >
              Request This Website <ArrowRight size={17} aria-hidden />
            </Button>
            <Button
              href={whatsappLink(waMessage)}
              variant="whatsapp"
              size="lg"
              target="_blank"
              onClick={() => track('whatsapp_clicked', { location: 'calculator' })}
            >
              <MessageCircle size={17} aria-hidden /> Send Estimate on WhatsApp
            </Button>
          </div>

          <p className="text-xs leading-5 text-muted-foreground">{calculatorConfig.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
