/**
 * /privacy-policy — plain-language privacy policy for a lead-generation site.
 * NOTE: this is a general template, not legal advice. Review for your
 * jurisdiction and data-processing reality before publishing.
 */
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { Section, Container } from '@/components/ui/Layout';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} collects, uses and protects personal information submitted through this website.`,
  path: '/privacy-policy',
});

const sections = [
  {
    heading: 'Information I collect',
    body: 'When you submit the contact or website-request form, I collect the information you provide: name, email address, phone number, business name, website URL (if any), project type, budget range and your message. If you use the quote calculator and send the estimate, the selected project requirements are included as well. Basic technical data (such as IP address and browser type) may be processed by the hosting provider for security and rate-limiting purposes.',
  },
  {
    heading: 'How information is used',
    body: 'Submitted information is used solely to respond to your enquiry, prepare a proposal for your project, and — if we work together — to deliver and support the project. It is not sold, rented or shared with third parties for marketing purposes.',
  },
  {
    heading: 'Analytics',
    body: 'This site may use privacy-friendly analytics (such as Google Analytics, only if configured) to understand aggregate traffic and which pages are useful. No advertising or cross-site tracking pixels are installed. You can block analytics with browser settings or extensions.',
  },
  {
    heading: 'Cookies',
    body: 'This website uses no advertising or tracking cookies. A session cookie is used only to keep you signed in to the admin area, and a preference cookie may store your light/dark theme choice. These are deleted or expire automatically.',
  },
  {
    heading: 'Data storage and retention',
    body: 'Enquiry data is stored in a secured database with access limited to the site owner. Data is retained only as long as needed for the purpose it was collected for, or as required for legitimate business records, after which it is deleted or anonymised.',
  },
  {
    heading: 'Third-party services',
    body: 'This website is hosted on infrastructure providers (e.g., Vercel and a PostgreSQL database provider) which process data under their own privacy policies. If you contact me via WhatsApp or email, that communication is governed by the privacy policy of that service.',
  },
  {
    heading: 'Your rights',
    body: 'You may request access to, correction of, or deletion of the personal information you have submitted, by emailing ' + siteConfig.email + '. I will respond to legitimate requests within a reasonable period.',
  },
  {
    heading: 'Changes to this policy',
    body: 'This policy may be updated as the site or applicable requirements change. The latest version is always available on this page.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Section size="lg">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-3">Legal</p>
          <h1 className="font-display text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>

          <div className="mt-10 space-y-9">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-xl font-bold tracking-tight">{s.heading}</h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{s.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-10 rounded-xl border border-border bg-muted/50 p-4 text-xs leading-5 text-muted-foreground">
            This document is a general template provided for convenience and does not constitute
            legal advice. It should be reviewed to reflect your actual data practices and the legal
            requirements that apply to you before being published.
          </p>
        </div>
      </Container>
    </Section>
  );
}
