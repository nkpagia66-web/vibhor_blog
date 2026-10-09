/**
 * /projects — filterable portfolio of completed work.
 */
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getProjects } from '@/lib/content';
import { whatsappLink } from '@/config/site';
import { buildMetadata, JsonLd, faqJsonLd } from '@/lib/seo';
import { getFaqs } from '@/lib/content';
import { Section, Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Projects & Case Studies — Websites, E-commerce, Web Apps',
  description:
    'A selection of websites, e-commerce stores and web applications I have designed and built for businesses — with live links and case studies.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  const faqs = (await getFaqs()).filter((f) => f.category === 'Capabilities').slice(0, 4);

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <Section size="lg" className="border-b border-border">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow mb-3">Selected work</p>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Projects I&apos;ve shipped
              </h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Real websites and platforms built for real businesses — from marketplaces to
                corporate sites. Filter by category to find work similar to your project.
              </p>
            </div>
            <Button href="/request-website" size="lg" className="shrink-0">
              Start your project <ArrowRight size={18} aria-hidden />
            </Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <ProjectsGrid projects={projects} />
        </Container>
      </Section>

      <Section className="border-t border-border bg-card/40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Your project could be next
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tell me what you need and get a clear proposal with scope, timeline and price.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/request-website" size="lg">
                Request a Website <ArrowRight size={18} aria-hidden />
              </Button>
              <Button
                href={whatsappLink()}
                variant="whatsapp"
                size="lg"
                target="_blank"
              >
                <MessageCircle size={18} aria-hidden /> Chat on WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
