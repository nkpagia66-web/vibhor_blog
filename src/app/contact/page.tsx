/**
 * /contact — contact form + direct WhatsApp/email channels.
 */
import { MessageCircle, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { siteConfig, whatsappLink } from '@/config/site';
import { buildMetadata, JsonLd, faqJsonLd } from '@/lib/seo';
import { getFaqs } from '@/lib/content';
import { Section, Container, SectionHeading, Badge } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { ContactForm } from '@/components/forms/ContactForm';
import { TrackedAnchor } from '@/components/ui/TrackedAnchor';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Contact — Start Your Website Project',
  description:
    'Get in touch about your website project. WhatsApp, email or the contact form — responses within one business day.',
  path: '/contact',
});

export default async function ContactPage() {
  const faqs = (await getFaqs()).filter((f) => f.category === 'Process').slice(0, 3);

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <Section size="lg" className="border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Contact</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Tell me about your project
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Share your requirements and you will hear back within one business day with next
              steps, a timeline and a clear price.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            {/* form */}
            <div className="lg:col-span-3">
              <div className="card p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold">Send a message</h2>
                <p className="mb-6 mt-1 text-sm text-muted-foreground">
                  All fields marked with <span className="text-danger">*</span> are required.
                </p>
                <ContactForm source="contact" />
              </div>
            </div>

            {/* direct channels */}
            <aside className="space-y-5 lg:col-span-2">
              <div className="card p-6">
                <h2 className="font-display text-lg font-bold">Direct channels</h2>
                <div className="mt-5 space-y-3">
                  <TrackedAnchor
                    href={whatsappLink()}
                    event="whatsapp_clicked"
                    params={{ location: 'contact_page' }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-all hover:border-[#25D366]/60"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366]">
                      <MessageCircle size={20} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">WhatsApp</span>
                      <span className="block text-sm text-muted-foreground">
                        {siteConfig.whatsappDisplay} — fastest replies
                      </span>
                    </span>
                  </TrackedAnchor>

                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-all hover:border-accent/60"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Mail size={20} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">Email</span>
                      <span className="block break-all text-sm text-muted-foreground">
                        {siteConfig.email}
                      </span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Clock size={18} className="text-accent" aria-hidden /> What happens next
                </h2>
                <ol className="mt-4 space-y-4">
                  {[
                    'I review your requirements carefully',
                    'You get a reply with questions or next steps',
                    'A proposal with scope, price and timeline follows',
                    'Work begins once you approve the proposal',
                  ].map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="card p-6">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="success">Free consultation</Badge>
                  <Badge tone="accent">Clear pricing</Badge>
                  <Badge tone="default">No obligation</Badge>
                </div>
                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" aria-hidden />
                  Getting a quote costs nothing and puts you under no obligation.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-card/40">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              title="Prefer to see pricing first?"
              description="Every package and the instant quote calculator are on the pricing page."
              align="center"
            />
            <Button href="/pricing" size="lg" className="mt-6">
              View pricing packages
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
