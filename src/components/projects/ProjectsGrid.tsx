'use client';

/**
 * ProjectsGrid — filterable premium grid used on / and /projects.
 */
import { useMemo, useState } from 'react';
import type { Project, ProjectCategory } from '@/config/projects';
import { projectCategories } from '@/config/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { cn } from '@/lib/utils';

const filters = ['All', ...projectCategories] as const;

export function ProjectsGrid({
  projects,
  compact = false,
  showFilters = true,
}: {
  projects: Project[];
  compact?: boolean;
  showFilters?: boolean;
}) {
  const [active, setActive] = useState<(typeof filters)[number]>('All');

  const visible = useMemo(() => {
    const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);
    return compact ? filtered.slice(0, 6) : filtered;
  }, [projects, active, compact]);

  if (projects.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-muted-foreground">Projects will appear here once they are added.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showFilters && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter projects by category"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                active === f
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <ProjectCard key={project.slug} project={project} priority={i < 3} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
