/**
 * Home page — 11 sections arranged around the lead-generation funnel:
 * understand → see work → see pricing → calculate → request → contact.
 */
import Link from 'next/link';
import {
  ArrowRight,
  MessageCircle,
  Check,
  Zap,
  Smartphone,
  Code2,
  ShieldCheck,
  Headphones,
  Layers,
  Gauge,
  Users,
  Rocket,
  Search,
  PencilRuler,
  TrendingUp,
} from 'lucide-react';
import { siteConfig, whatsappLink } from '@/config/site';
import { getProjects, getServices, getPricingPlans, getFaqs } from '@/lib/content';
import { subscriptionConfig, formatINR } from '@/config/pricing';
import { buildMetadata, JsonLd, faqJsonLd } from '@/lib/seo';
import { Section, Container, SectionHeading, Badge } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { QuoteCalculator } from '@/components/home/QuoteCalculator';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { ContactForm } from '@/components/forms/ContactForm';
import { getPublishedPosts } from '@/lib/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Web Developer India — Websites, E-commerce & Full-Stack Apps',
  description:
    'Freelance web developer building fast, modern websites, e-commerce stores and full-stack applications. Professional websites starting from ₹9,999. View work, pricing and instant quotes.',
  path: '/',
});

const trustItems = [
  { icon: 'Check', label: '8 Completed Projects', note: 'Live client work across industries' },
  { icon: 'Layers', label: 'Full-Stack Development', note: 'Front-end, back-end, databases' },
  { icon: 'Code2', label: 'Modern Technology', note: 'React, Next.js, TypeScript, Node' },
  { icon: 'Smartphone', label: 'Responsive Design', note: 'Mobile-first, every screen size' },
  { icon: 'Headphones', label: 'Ongoing Support', note: 'Maintenance plans after launch' },
];

const processSteps = [
  {
    title: 'Tell Me Your Requirement',
    description:
      'Share your goals, content and timeline through the request form, WhatsApp or a quick call.',
  },
  {
    title: 'Get a Proposal',
    description:
      'You receive a clear scope, timeline and fixed price — no surprises after work begins.',
  },
  {
    title: 'Development & Review',
    description:
      'I build in stages and share progress for review, so you see the site take shape and give feedback early.',
  },
  {
    title: 'Launch & Support',
    description:
      'After testing across devices, the site goes live — with optional monthly hosting and maintenance.',
  },
];

const whyItems = [
  { icon: 'Layers', title: 'Full-stack development', text: 'Design, front-end, back-end and databases handled by one person — fewer handoffs, faster decisions.' },
  { icon: 'Code2', title: 'Modern technologies', text: 'Built with React, Next.js, TypeScript and Node — the same stack used by leading product companies.' },
  { icon: 'Smartphone', title: 'Mobile-first design', text: 'Most of your visitors are on phones, so every layout starts there and scales up.' },
  { icon: 'Gauge', title: 'Performance-focused', text: 'Optimized assets, server rendering and lazy loading to keep Core Web Vitals strong.' },
  { icon: 'TrendingUp', title: 'Scalable architecture', text: 'Structured so your site can grow — more pages, features and traffic without a rebuild.' },
  { icon: 'Users', title: 'Direct communication', text: 'You work with me directly. No account managers, no ticket queues, no runaround.' },
  { icon: 'ShieldCheck', title: 'Post-launch support', text: 'Optional care plans for hosting, updates, backups and fixes after the site is live.' },
  { icon: 'PencilRuler', title: 'Custom solutions', text: 'No templates forced onto your business — each build fits your actual requirements.' },
];

const servicesToShow = 6;

export default async function HomePage() {
  const [projects, allServices, plans, faqs] = await Promise.all([
    getProjects(),
    getServices(),
    getPricingPlans(),
    getFaqs(),
  ]);

  const featuredProjects = projects.filter((p) => p.featured).length >= 3
    ? projects.filter((p) => p.featured)
    : projects.slice(0, 6);

  const faqSlice = faqs.slice(0, 6);

  return (
    <>
      <JsonLd data={faqJsonLd(faqSlice)} />

      {/* ============================= SECTION 1 — HERO ============================= */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-4xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Available for freelance &amp; remote work
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Websites &amp; Digital Experiences That{' '}
              <span className="bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent">
                Help Businesses Grow
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              I design and build fast, modern and production-ready websites, e-commerce platforms
              and full-stack applications for businesses that want a stronger presence online.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/request-website"
                size="lg"
                trackEvent="pricing_cta_clicked"
                trackParams={{ location: 'hero' }}
              >
                Start Your Project <ArrowRight size={18} aria-hidden />
              </Button>
              <Button href="/projects" variant="outline" size="lg">
                View My Work
              </Button>
              <Button
                href={whatsappLink()}
                variant="whatsapp"
                size="lg"
                target="_blank"
                trackEvent="whatsapp_clicked"
                trackParams={{ location: 'hero' }}
              >
                <MessageCircle size={18} aria-hidden /> Chat on WhatsApp
              </Button>
            </div>

            <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 sm:grid-cols-3 lg:grid-cols-5">
              {trustItems.map((item) => {
                const IconCmp = { Check, Zap, Code2, Smartphone, Headphones, Layers }[
                  item.icon as 'Check' | 'Zap' | 'Code2' | 'Smartphone' | 'Headphones' | 'Layers'
                ];
                return (
                  <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                    <IconCmp size={22} className="text-accent" aria-hidden />
                    <dt className="text-sm font-semibold leading-5">{item.label}</dt>
                    <dd className="text-xs leading-4 text-muted-foreground">{item.note}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </Container>
      </section>

      {/* ========================= SECTION 3 — SERVICES ========================= */}
      <Section id="services">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="What I build for businesses"
            description="From first websites to complex platforms — every project is designed, engineered and launched to production standards."
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allServices.slice(0, servicesToShow).map((service) => (
              <div
                key={service.slug}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon name={service.icon} size={21} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {service.shortDescription}
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {service.benefits.slice(0, 2).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check size={13} className="mt-0.5 shrink-0 text-success" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services#${service.slug}`}
                  className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-accent hover:opacity-80"
                >
                  Learn more <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button href="/services" variant="outline">
              View all services <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
        </Container>
      </Section>

      {/* ====================== SECTION 4 — FEATURED PROJECTS ====================== */}
      <Section className="border-y border-border bg-card/40">
        <Container>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Selected work"
              title="Projects I've shipped"
              description="Real websites and platforms built for real businesses — filter by category to find relevant work."
            />
            <Button href="/projects" variant="outline" className="shrink-0">
              All projects <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
          <ProjectsGrid projects={featuredProjects} compact />
        </Container>
      </Section>

      {/* ========================= SECTION 5 — HOW IT WORKS ========================= */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="From idea to launch in four steps"
            description="A simple, transparent process — you always know what is happening next."
            align="center"
            className="mb-12"
          />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {i < processSteps.length - 1 && (
                  <ArrowRight
                    size={18}
                    aria-hidden
                    className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-accent/50 lg:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ========================== SECTION 6 — PRICING ========================== */}
      <Section className="border-y border-border bg-card/40">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Professional websites starting from ₹9,999"
            description="Transparent packages with a clear split between one-time development and optional monthly care."
            align="center"
            className="mb-4"
          />
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-muted-foreground">
            One-time development fee builds the site. The optional monthly plan covers hosting,
            maintenance and support — you choose.
          </p>

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
                <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.audience}</p>

                <div className="mt-5">
                  {plan.billingType === 'custom' ? (
                    <p className="font-display text-3xl font-bold tracking-tight">
                      Let&apos;s discuss
                    </p>
                  ) : (
                    <p className="font-display text-4xl font-bold tracking-tight tabular-nums">
                      {formatINR(plan.price)}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    one-time development
                    {plan.monthlyPrice ? (
                      <span className="tabular-nums"> + {formatINR(plan.monthlyPrice)}/month</span>
                    ) : null}
                  </p>
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.slice(0, 7).map((f) => (
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
                  trackEvent="pricing_cta_clicked"
                  trackParams={{ location: 'home_pricing', plan: plan.slug }}
                >
                  Get My Website
                </Button>
              </div>
            ))}
          </div>

          {/* subscription explained */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-background p-6 text-center sm:p-8">
            <Badge tone="accent">{subscriptionConfig.name}</Badge>
            <p className="mt-4 font-display text-2xl font-bold tabular-nums">
              {formatINR(subscriptionConfig.monthlyPrice)}
              <span className="text-base font-medium text-muted-foreground">/month</span>
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{subscriptionConfig.intro}</p>
            <ul className="mt-5 grid gap-2 text-left sm:grid-cols-2">
              {subscriptionConfig.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={14} className="mt-1 shrink-0 text-success" aria-hidden />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">{subscriptionConfig.note}</p>
            <Button href="/pricing" variant="outline" className="mt-6">
              Compare packages <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
        </Container>
      </Section>

      {/* ====================== SECTION 7 — QUOTE CALCULATOR ====================== */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Instant estimate"
            title="Calculate your website cost"
            description="Select your requirements and get an estimated price immediately — then send it straight to me for a proper quote."
            align="center"
            className="mb-10"
          />
          <QuoteCalculator />
        </Container>
      </Section>

      {/* ===================== SECTION 8 — WHY WORK WITH ME ===================== */}
      <Section className="border-y border-border bg-card/40">
        <Container>
          <SectionHeading
            eyebrow="Why work with me"
            title="Built like a studio project, managed like a partnership"
            description="The depth of an agency with the directness of working with the person who actually builds your site."
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon name={item.icon} size={19} />
                </span>
                <h3 className="mt-4 text-sm font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ========================== SECTION 9 — BLOG ========================== */}
      <Section>
        <Container>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Blog"
              title="Notes from the build log"
              description="Practical writing on web development, pricing and technology decisions."
            />
            <Button href="/blog" variant="outline" className="shrink-0">
              Read the blog <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
          <BlogPreview />
        </Container>
      </Section>

      {/* ============================ SECTION 10 — FAQ ============================ */}
      <Section className="border-y border-border bg-card/40">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SectionHeading
                eyebrow="FAQ"
                title="Questions, answered honestly"
                description="Straight answers about pricing, timelines and what working together looks like."
              />
              <Button href="/faq" variant="outline" className="mt-6">
                All FAQs <ArrowRight size={16} aria-hidden />
              </Button>
            </div>
            <div className="lg:col-span-2">
              <FAQAccordion items={faqSlice} />
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================== SECTION 11 — CONTACT =========================== */}
      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card sm:p-12">
            <div
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid gap-10 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="Contact"
                  title="Let's build something great"
                  description={`Tell me about your project and you'll hear back within one business day. Prefer chat? Message me directly on WhatsApp.`}
                />
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button
                    href={whatsappLink()}
                    variant="whatsapp"
                    size="lg"
                    target="_blank"
                    trackEvent="whatsapp_clicked"
                    trackParams={{ location: 'home_contact' }}
                  >
                    <MessageCircle size={18} aria-hidden /> WhatsApp {siteConfig.whatsappDisplay}
                  </Button>
                  <Button href={`mailto:${siteConfig.email}`} variant="outline" size="lg">
                    Email me
                  </Button>
                </div>
                <ul className="mt-8 space-y-2.5">
                  {[
                    'Free consultation to scope your project',
                    'Clear pricing before any work starts',
                    'Direct communication — you talk to the builder',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Rocket size={15} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-background p-6">
                <HomeContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

/* ----------------------------- blog preview ------------------------------ */

async function BlogPreview() {
  const posts = await getPublishedPosts();
  if (posts.length === 0) {
    return (
      <div className="card p-8 text-center text-muted-foreground">
        New articles are on the way — <Link href="/blog" className="text-accent underline">visit the blog</Link> for updates.
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-card"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge tone="accent">{post.category}</Badge>
            <span>{post.readingTimeMin} min read</span>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold leading-6 transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            Read article <ArrowRight size={14} aria-hidden />
          </span>
        </Link>
      ))}
    </div>
  );
}

function HomeContactForm() {
  return <ContactForm source="contact" compact />;
}
