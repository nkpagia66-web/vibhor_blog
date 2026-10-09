/**
 * /request-website — dedicated lead capture page for website requests.
 * Reads ?from=calculator and basic query params to pre-fill the form.
 */
import { MessageCircle, ShieldCheck, Clock, FileText } from 'lucide-react';
import { whatsappLink } from '@/config/site';
import { buildMetadata, JsonLd, faqJsonLd } from '@/lib/seo';
import { getFaqs } from '@/lib/content';
import { Section, Container, Badge } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { ContactForm } from '@/components/forms/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Request a Website — Get a Quote in One Day',
  description:
    'Request your website: share your requirements and get a clear proposal with scope, timeline and fixed price — usually within one business day.',
  path: '/request-website',
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RequestWebsitePage({ searchParams }: Props) {
  const params = await searchParams;
  const from = typeof params.from === 'string' ? params.from : undefined;
  const faqs = (await getFaqs()).filter((f) => f.category === 'Process').slice(0, 4);

  const defaultMessage =
    from === 'calculator'
      ? 'I used your website quote calculator and would like a proper quote for my project.\n\nMy requirements:\n- Website type: \n- Pages: \n- Features I need: \n- Timeline: '
      : '';

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <Section size="lg" className="border-b border-border">
        <Container>
          <div className="max-w-3xl">
            {from === 'calculator' && (
              <Badge tone="accent" className="mb-4">
                From your calculator estimate
              </Badge>
            )}
            <p className="eyebrow mb-3">Request a website</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Get your website project started
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Fill in your requirements below and receive a clear proposal — scope, timeline and a
              fixed price — usually within one business day.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="card p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold">Your requirements</h2>
                <p className="mb-6 mt-1 text-sm text-muted-foreground">
                  The more detail you share, the more accurate your quote will be.
                </p>
                <ContactForm
                  source={from === 'calculator' ? 'calculator' : 'request-website'}
                  defaultMessage={defaultMessage}
                />
              </div>
            </div>

            <aside className="space-y-5 lg:col-span-2">
              <div className="card p-6">
                <h2 className="font-display text-lg font-bold">What you get</h2>
                <ul className="mt-4 space-y-4">
                  {[
                    {
                      icon: FileText,
                      title: 'A detailed proposal',
                      text: 'Scope, deliverables, timeline and a fixed price in writing.',
                    },
                    {
                      icon: Clock,
                      title: 'Fast response',
                      text: 'Replies within one business day, usually much sooner.',
                    },
                    {
                      icon: ShieldCheck,
                      title: 'No obligation',
                      text: 'The quote is free — decide afterwards whether to proceed.',
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        <item.icon size={17} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-bold">{item.title}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">{item.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6 text-center">
                <p className="text-sm font-semibold">Want to talk first?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quick questions are welcome on WhatsApp.
                </p>
                <Button
                  href={whatsappLink(
                    'Hi Vibhor, I want to request a website but have a few questions first.',
                  )}
                  variant="whatsapp"
                  className="mt-4 w-full"
                  target="_blank"
                  trackEvent="whatsapp_clicked"
                  trackParams={{ location: 'request_page' }}
                >
                  <MessageCircle size={16} aria-hidden /> Chat on WhatsApp
                </Button>
              </div>

              <div className="card p-6">
                <Badge tone="accent">Not sure about requirements?</Badge>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  That is completely normal. Send what you know — describing your business and goal
                  is enough, and I will help structure the rest.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
