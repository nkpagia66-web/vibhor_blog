/**
 * /services — full service catalogue with anchors, benefits and CTAs.
 */
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { getServices } from '@/lib/content';
import { whatsappLink } from '@/config/site';
import { buildMetadata, JsonLd, organizationJsonLd } from '@/lib/seo';
import { Section, Container, SectionHeading, Badge } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Website Development Services — Business Sites, E-commerce, Apps',
  description:
    'Professional website development services: business websites, e-commerce, custom web applications, admin dashboards, APIs, redesigns, maintenance and SEO optimization.',
  path: '/services',
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <Section size="lg" className="border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Services</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Development services built around business outcomes
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Every service below is delivered by me directly — from first wireframe to production
              deployment. Pick what you need, or combine services into a single project.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/request-website" size="lg">
                Request a Website <ArrowRight size={18} aria-hidden />
              </Button>
              <Button href={whatsappLink()} variant="whatsapp" size="lg" target="_blank"
                trackEvent="whatsapp_clicked"
                trackParams={{ location: 'services_hero' }}>
                <MessageCircle size={18} aria-hidden /> Discuss your project
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="space-y-8">
            {services.map((service, i) => (
              <article
                key={service.slug}
                id={service.slug}
                className="scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
              >
                <div className={`grid gap-0 ${i % 2 === 1 ? 'lg:grid-cols-[1fr_1.4fr]' : 'lg:grid-cols-[1.4fr_1fr]'}`}>
                  <div className={`p-7 sm:p-10 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <Icon name={service.icon} size={24} />
                    </span>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-2xl font-bold tracking-tight">{service.name}</h2>
                      {service.featured && <Badge tone="accent">Popular</Badge>}
                    </div>
                    <p className="mt-3 leading-7 text-muted-foreground">{service.description}</p>
                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                      <Button
                        href="/request-website"
                        trackEvent="service_cta_clicked"
                        trackParams={{ service: service.slug, cta: 'request' }}
                      >
                        Get a quote
                      </Button>
                      <Button
                        href={whatsappLink(
                          `Hi Vibhor, I'm interested in your ${service.name} service. Here's what I need:`,
                        )}
                        variant="outline"
                        target="_blank"
                        trackEvent="service_cta_clicked"
                        trackParams={{ service: service.slug, cta: 'whatsapp' }}
                      >
                        <MessageCircle size={16} aria-hidden /> Ask on WhatsApp
                      </Button>
                    </div>
                  </div>

                  <div className={`border-t border-border bg-muted/40 p-7 sm:p-10 lg:border-t-0 ${
                    i % 2 === 1 ? 'lg:order-1 lg:border-r' : 'lg:border-l'
                  }`}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      What you get
                    </h3>
                    <ul className="mt-5 space-y-3.5">
                      {service.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm leading-6">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                            <Check size={12} aria-hidden />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA band */}
      <Section className="border-t border-border bg-card/40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Next step"
              title="Not sure which service you need?"
              description="Describe your goal in a message and I will tell you exactly what is involved — with a price and timeline before any work starts."
              align="center"
            />
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/request-website" size="lg">
                Start Your Project <ArrowRight size={18} aria-hidden />
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                See pricing
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
