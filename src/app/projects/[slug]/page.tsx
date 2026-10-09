/**
 * /projects/[slug] — project detail with optional case study.
 * Falls back to notFound() for unknown slugs.
 */
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft, ArrowRight, MessageCircle, Check } from 'lucide-react';
import { getProjects, getProject } from '@/lib/content';
import { whatsappLink } from '@/config/site';
import { buildMetadata, JsonLd, projectJsonLd } from '@/lib/seo';
import { Section, Container, Badge } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { ProjectVisual } from '@/components/projects/ProjectCard';
import type { Metadata } from 'next';

// project content changes only when the admin edits it — allow fresh reads
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project not found' };
  return buildMetadata({
    title: `${project.name} — ${project.category} Project`,
    description: project.description,
    path: `/projects/${project.slug}`,
    type: 'article',
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const projects = await getProjects();
  const related = projects.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 3);
  const more = related.length > 0 ? related : projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />

      <Section size="lg" className="border-b border-border">
        <Container>
          <Button href="/projects" variant="ghost" size="sm" className="mb-8 -ml-3">
            <ArrowLeft size={16} aria-hidden /> All projects
          </Button>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">{project.category}</Badge>
                {!project.live && <Badge tone="warning">Site currently offline</Badge>}
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {project.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                {project.description}
              </p>

              {project.longDescription && (
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {project.longDescription}
                </p>
              )}

              {project.technologies.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Technologies
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <li
                        key={t}
                        className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  href={project.liveUrl}
                  target="_blank"
                  size="lg"
                  trackEvent="project_cta_clicked"
                  trackParams={{ slug: project.slug, cta: 'live_site_detail' }}
                >
                  Visit Live Site <ExternalLink size={16} aria-hidden />
                </Button>
                <Button href="/request-website" variant="outline" size="lg">
                  Build something like this <ArrowRight size={16} aria-hidden />
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <ProjectVisual project={project} priority />
            </div>
          </div>
        </Container>
      </Section>

      {project.features.length > 0 && (
        <Section>
          <Container>
            <div className="grid gap-10 lg:grid-cols-3">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Key features</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Functionality delivered as part of this project.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {project.caseStudy && (
        <Section id="case-study" className="border-y border-border bg-card/40 scroll-mt-20">
          <Container>
            <p className="eyebrow mb-3">Case study</p>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              How {project.name} was approached
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { label: 'The challenge', text: project.caseStudy.challenge },
                { label: 'The approach', text: project.caseStudy.approach },
                { label: 'The outcome', text: project.caseStudy.outcome },
              ].map((block) => (
                <div key={block.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
                    {block.label}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{block.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {more.length > 0 && (
        <Section>
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-tight">More projects</h2>
              <Button href="/projects" variant="outline" size="sm">
                View all
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <a
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-accent/40"
                >
                  <div className="flex items-center justify-between">
                    <Badge tone="accent">{p.category}</Badge>
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold group-hover:text-accent">
                    {p.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                </a>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-muted/40 p-8 text-center">
              <h2 className="font-display text-2xl font-bold">Want a project like these?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Get a clear proposal with scope, timeline and price — usually within one business day.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/request-website" size="lg">
                  Start Your Project <ArrowRight size={18} aria-hidden />
                </Button>
                <Button href={whatsappLink()} variant="whatsapp" size="lg" target="_blank">
                  <MessageCircle size={18} aria-hidden /> Chat on WhatsApp
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
