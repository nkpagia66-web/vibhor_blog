/**
 * /faq — full FAQ page with FAQPage structured data.
 */
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getFaqs } from '@/lib/content';
import { whatsappLink } from '@/config/site';
import { buildMetadata, JsonLd, faqJsonLd } from '@/lib/seo';
import { Section, Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ — Website Pricing, Timelines & Support',
  description:
    'Answers to common questions about website costs, development timelines, hosting, maintenance, e-commerce, admin panels and custom functionality.',
  path: '/faq',
});

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      <Section size="lg" className="border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">FAQ</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Honest answers about pricing, timelines, capabilities and what working together
              looks like.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={faqs} />

            <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="font-display text-2xl font-bold">Still have a question?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Ask directly — no sales pressure, no obligation.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/contact" size="lg">
                  Ask a question <ArrowRight size={18} aria-hidden />
                </Button>
                <Button
                  href={whatsappLink('Hi Vibhor, I have a question about your services:')}
                  variant="whatsapp"
                  size="lg"
                  target="_blank"
                >
                  <MessageCircle size={18} aria-hidden /> Ask on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
