/**
 * /pricing — packages, comparison table, monthly care plan, calculator CTA.
 */
import Link from 'next/link';
import { ArrowRight, Check, MessageCircle, Info } from 'lucide-react';
import { getPricingPlans } from '@/lib/content';
import { subscriptionConfig, formatINR } from '@/config/pricing';
import { whatsappLink } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { Section, Container, SectionHeading, Badge } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { QuoteCalculator } from '@/components/home/QuoteCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Website Pricing — Packages from ₹9,999',
  description:
    'Transparent website development pricing: Starter ₹9,999, Business ₹24,999, Premium custom builds. Optional ₹1,499/month care plan. Instant quote calculator included.',
  path: '/pricing',
});

const comparisonRows = [
  { label: 'Custom, mobile-responsive design', starter: true, business: true, premium: true },
  { label: 'Contact form & WhatsApp integration', starter: true, business: true, premium: true },
  { label: 'On-page SEO setup', starter: true, business: true, premium: true },
  { label: 'Launch & deployment support', starter: true, business: true, premium: true },
  { label: 'More pages & richer content sections', starter: false, business: true, premium: true },
  { label: 'Blog / news section', starter: false, business: true, premium: true },
  { label: 'Analytics integration', starter: false, business: true, premium: true },
  { label: 'E-commerce & product management', starter: false, business: false, premium: true },
  { label: 'Admin dashboards & user accounts', starter: false, business: false, premium: true },
  { label: 'Payment gateways & API integrations', starter: false, business: false, premium: true },
  { label: 'AI-powered features', starter: false, business: false, premium: true },
];

export default async function PricingPage() {
  const plans = await getPricingPlans();
  const [starter, business, premium] = [
    plans.find((p) => p.slug === 'starter'),
    plans.find((p) => p.slug === 'business'),
    plans.find((p) => p.slug === 'premium'),
  ];

  const cellFor = (row: (typeof comparisonRows)[number], key: 'starter' | 'business' | 'premium') =>
    row[key] ? (
      <Check size={17} className="mx-auto text-success" aria-label="Included" />
    ) : (
      <span className="mx-auto block h-1 w-1 rounded-full bg-muted-foreground/40" aria-label="Not included" />
    );

  return (
    <>
      <Section size="lg" className="border-b border-border">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-3">Pricing</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Professional websites starting from{' '}
              <span className="text-accent tabular-nums">₹9,999</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Transparent packages — one-time development fees with an optional monthly care plan.
              No hidden costs, no vague quotes.
            </p>
          </div>
        </Container>
      </Section>

      {/* -------- plan cards -------- */}
      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.slug}
                className={
                  plan.recommended
                    ? 'relative flex flex-col rounded-3xl border-2 border-accent bg-card p-7 shadow-glow'
                    : 'flex flex-col rounded-3xl border border-border bg-card p-7 shadow-soft'
                }
              >
                {plan.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                    Most popular
                  </span>
                )}
                <h2 className="font-display text-xl font-bold">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{plan.audience}</p>

                <div className="mt-6">
                  {plan.billingType === 'custom' ? (
                    <p className="font-display text-3xl font-bold tracking-tight">Let&apos;s discuss</p>
                  ) : (
                    <p className="font-display text-4xl font-bold tracking-tight tabular-nums">
                      {formatINR(plan.price)}
                    </p>
                  )}
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    one-time development
                    {plan.monthlyPrice ? (
                      <span className="tabular-nums"> + {formatINR(plan.monthlyPrice)}/month</span>
                    ) : null}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">{plan.description}</p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-border pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={15} className="mt-0.5 shrink-0 text-success" aria-hidden />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/request-website"
                  variant={plan.recommended ? 'primary' : 'outline'}
                  className="mt-7 w-full"
                  size="lg"
                  trackEvent="pricing_cta_clicked"
                  trackParams={{ location: 'pricing_page', plan: plan.slug }}
                >
                  {plan.ctaText}
                </Button>
              </div>
            ))}
          </div>

          {/* comparison table */}
          <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <caption className="sr-only">Feature comparison between pricing packages</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Feature
                    </th>
                    <th scope="col" className="px-5 py-4 text-center font-semibold">
                      Starter
                    </th>
                    <th scope="col" className="px-5 py-4 text-center font-semibold text-accent">
                      Business
                    </th>
                    <th scope="col" className="px-5 py-4 text-center font-semibold">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-0">
                      <th scope="row" className="px-5 py-3.5 text-left font-medium text-muted-foreground">
                        {row.label}
                      </th>
                      <td className="px-5 py-3.5 text-center">{cellFor(row, 'starter')}</td>
                      <td className="px-5 py-3.5 text-center bg-accent/5">{cellFor(row, 'business')}</td>
                      <td className="px-5 py-3.5 text-center">{cellFor(row, 'premium')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Custom functionality can be added to any package — final scope and price are always
            agreed before work begins.
          </p>
        </Container>
      </Section>

      {/* -------- one-time vs monthly -------- */}
      <Section className="border-y border-border bg-card/40">
        <Container>
          <SectionHeading
            eyebrow="One-time vs monthly"
            title="Two costs, clearly separated"
            description="Most confusion about website pricing comes from mixing these up. Here is exactly what each one covers."
            align="center"
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <Badge tone="accent">One-time development</Badge>
              <p className="mt-4 font-display text-3xl font-bold tabular-nums">From ₹9,999</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Paid once. Covers the design, build, testing and launch of your website.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {['Discovery and planning', 'Design and development', 'Testing across devices', 'Deployment to hosting'].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <Check size={15} className="shrink-0 text-success" aria-hidden />
                      <span className="text-muted-foreground">{t}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <Badge tone="success">Monthly care plan — optional</Badge>
              <p className="mt-4 font-display text-3xl font-bold tabular-nums">
                {formatINR(subscriptionConfig.monthlyPrice)}
                <span className="text-base font-medium text-muted-foreground">/month</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{subscriptionConfig.intro}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {subscriptionConfig.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check size={15} className="shrink-0 text-success" aria-hidden />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
                {subscriptionConfig.note}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------- calculator -------- */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Instant estimate"
            title="Build your own estimate"
            description="Adjust the requirements below and watch the estimate update live — then send it to me for a proper quote."
            align="center"
            className="mb-10"
          />
          <QuoteCalculator />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need something specific?{' '}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline underline-offset-4"
            >
              Message me on WhatsApp
            </a>{' '}
            or read the{' '}
            <Link href="/faq" className="font-semibold text-accent underline underline-offset-4">
              pricing FAQ
            </Link>
            .
          </p>
        </Container>
      </Section>

      {/* -------- final CTA -------- */}
      <Section className="border-t border-border bg-card/40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Ready to get an exact price for your project?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Send your requirements and get a clear proposal — scope, timeline and fixed price —
              usually within one business day.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/request-website" size="lg">
                Get My Website <ArrowRight size={18} aria-hidden />
              </Button>
              <Button href={whatsappLink()} variant="whatsapp" size="lg" target="_blank"
                trackEvent="whatsapp_clicked"
                trackParams={{ location: 'pricing_footer' }}>
                <MessageCircle size={18} aria-hidden /> Chat on WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
