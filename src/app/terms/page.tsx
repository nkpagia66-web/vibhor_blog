/**
 * /terms — basic terms of service for website development engagements.
 * NOTE: general template, not legal advice.
 */
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { Section, Container } from '@/components/ui/Layout';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: `Terms governing use of ${siteConfig.url} and website development engagements with ${siteConfig.name}.`,
  path: '/terms',
});

const sections = [
  {
    heading: 'Use of this website',
    body: 'This website is provided to present services, portfolio work and informational content, and to accept project enquiries. You agree not to misuse the site, interfere with its operation, or attempt unauthorised access to its systems or data.',
  },
  {
    heading: 'Information on this site',
    body: 'Content is provided in good faith and kept current to the best of my knowledge. Prices, package details and timelines shown on this website are indicative; the definitive terms of any project are those in the written proposal or agreement you accept before work begins. The quote calculator produces estimates only and does not constitute a binding quotation.',
  },
  {
    heading: 'Project engagements',
    body: 'Work begins only after the scope, price and timeline are agreed in writing (email is sufficient). Delays in feedback, content or approvals may extend timelines accordingly. Changes outside the agreed scope may require a revised quote.',
  },
  {
    heading: 'Payment terms',
    body: 'Payment schedules (such as advance payment before work starts and balance before launch) are specified in the project proposal. Fees are quoted in Indian Rupees (INR) unless stated otherwise.',
  },
  {
    heading: 'Intellectual property',
    body: 'Upon receipt of full payment, you receive the rights to the final deliverables as agreed in the project proposal (excluding third-party assets, licensed fonts, libraries and stock resources, which remain subject to their own licences). Pre-existing tools and code I develop may continue to be used in other projects.',
  },
  {
    heading: 'Third-party services',
    body: 'The website may rely on third-party services (hosting, domains, payment gateways, APIs). Their availability, pricing and terms are governed by those providers and may change independently of this site.',
  },
  {
    heading: 'Limitation of liability',
    body: 'To the maximum extent permitted by law, I am not liable for indirect or consequential losses arising from use of this website or from delays outside my reasonable control. Nothing in these terms excludes liability that cannot lawfully be excluded.',
  },
  {
    heading: 'Changes to these terms',
    body: 'These terms may be updated from time to time. Continued use of this website after changes are posted constitutes acceptance of the revised terms.',
  },
  {
    heading: 'Contact',
    body: `Questions about these terms can be sent to ${siteConfig.email}.`,
  },
];

export default function TermsPage() {
  return (
    <Section size="lg">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-3">Legal</p>
          <h1 className="font-display text-4xl font-bold tracking-tight">Terms of Service</h1>
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
            legal advice. It should be reviewed for your jurisdiction and actual business
            arrangements before being published.
          </p>
        </div>
      </Container>
    </Section>
  );
}
