'use client';

/**
 * ProjectCard — premium card used in grids on /, /projects and /projects/[slug].
 * Client component: cards attach analytics handlers to their links.
 */
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/config/projects';
import { Badge } from '@/components/ui/Layout';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function ProjectVisual({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.image) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.category} project preview`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>
    );
  }
  // Placeholder system — swap in a real screenshot later via the `image` field.
  return (
    <div
      className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-accent-soft via-card to-card"
      aria-hidden="true"
    >
      <div className="bg-grid absolute inset-0 opacity-60" />
      <span className="relative font-display text-3xl font-bold tracking-tight text-accent/70 sm:text-4xl">
        {project.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()}
      </span>
    </div>
  );
}

export function ProjectCard({
  project,
  priority = false,
  className,
}: {
  project: Project;
  priority?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-card',
        className,
      )}
    >
      <ProjectVisual project={project} priority={priority} />

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{project.category}</Badge>
          {!project.live && <Badge tone="warning">Currently offline</Badge>}
        </div>

        <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors hover:text-accent"
            onClick={() => track('project_viewed', { slug: project.slug, surface: 'card' })}
          >
            {project.name}
          </Link>
        </h3>

        <p className="text-sm leading-6 text-muted-foreground">{project.description}</p>

        {project.technologies.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {project.technologies.slice(0, 5).map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/50 hover:text-accent"
            onClick={() => track('project_cta_clicked', { slug: project.slug, cta: 'view_project' })}
          >
            View Project <ArrowUpRight size={13} aria-hidden />
          </Link>
          {project.caseStudy && (
            <Link
              href={`/projects/${project.slug}#case-study`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/50 hover:text-accent"
              onClick={() => track('project_cta_clicked', { slug: project.slug, cta: 'case_study' })}
            >
              Case Study
            </Link>
          )}
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            onClick={() => track('project_cta_clicked', { slug: project.slug, cta: 'live_site' })}
          >
            Live Site <ExternalLink size={13} aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
