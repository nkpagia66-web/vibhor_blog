/**
 * /about — who I am, how I work, tech stack, and why hire me.
 */
import { ArrowRight, MessageCircle, Check } from 'lucide-react';
import { siteConfig, whatsappLink } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { Section, Container, SectionHeading, Badge } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'About — Web Designer & Full-Stack Developer',
  description:
    'Vibhor Agarwal Pagia — techy, detail-obsessed web designer and full-stack developer building fast, modern websites and applications since 2020.',
  path: '/about',
});

const techStack = [
  { group: 'Front-end', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { group: 'Back-end', items: ['Node.js', 'REST APIs', 'GraphQL', 'Databases'] },
  { group: 'Design & UX', items: ['UI design', 'Design systems', 'Accessibility', 'Responsive design'] },
  { group: 'Practice', items: ['Full-stack development', 'Performance optimization', 'SEO', 'Git'] },
];

const values = [
  {
    title: 'Detail-obsessed',
    text: 'Spacing, alignment, load times, edge cases — the small things are the difference between a site that looks professional and one that is.',
  },
  {
    title: 'Business-first decisions',
    text: 'Technology choices serve your goals, not my résumé. If a simpler approach works better, that is what gets recommended.',
  },
  {
    title: 'Transparent throughout',
    text: 'Clear pricing, written scope, staged reviews. You always know where the project stands.',
  },
  {
    title: 'Built to last',
    text: 'Clean, typed, documented code that another developer could pick up — no black boxes.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Section size="lg" className="border-b border-border">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-3">About</p>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                One person, four specialties
              </h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                I bridge the gap between product, design and engineering. Businesses hire me when
                they want a website built properly — fast, accessible, search-friendly and ready to
                grow — without agency overhead.
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Shipping production work since {siteConfig.foundedYear}: business websites,
                e-commerce stores, admin dashboards, APIs and full-stack applications. You work with
                me directly from first conversation to launch and beyond.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/request-website" size="lg">
                  Start Your Project <ArrowRight size={18} aria-hidden />
                </Button>
                <Button
                  href={whatsappLink()}
                  variant="whatsapp"
                  size="lg"
                  target="_blank"
                  trackEvent="whatsapp_clicked"
                  trackParams={{ location: 'about_page' }}
                >
                  <MessageCircle size={18} aria-hidden /> Chat on WhatsApp
                </Button>
              </div>
            </div>

            <div className="card p-7 sm:p-9">
              <h2 className="font-display text-lg font-bold">What I deliver</h2>
              <ul className="mt-5 space-y-3.5">
                {[
                  'Business websites that convert visitors into enquiries',
                  'E-commerce stores with real order workflows',
                  'Full-stack applications with secure authentication',
                  'Admin dashboards for day-to-day operations',
                  'REST & GraphQL APIs for integrations',
                  'Website redesigns and performance optimization',
                  'Post-launch maintenance and support',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm leading-6">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check size={12} aria-hidden />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* tech stack */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Technology stack"
            title="Tools I build with"
            description="A modern, proven stack — chosen for performance, maintainability and long-term support."
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((stack) => (
              <div key={stack.group} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
                  {stack.group}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {stack.items.map((item) => (
                    <li key={item}>
                      <Badge>{item}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* values */}
      <Section className="border-y border-border bg-card/40">
        <Container>
          <SectionHeading
            eyebrow="How I work"
            title="Principles behind every project"
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              title="Let's talk about your project"
              description="Whether you have a detailed brief or just an idea, the conversation starts the same way — tell me what you are trying to achieve."
              align="center"
            />
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/request-website" size="lg">
                Start Your Project <ArrowRight size={18} aria-hidden />
              </Button>
              <Button href="/projects" variant="outline" size="lg">
                See my work
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
