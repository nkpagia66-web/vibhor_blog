/**
 * /admin/projects — project list with create/edit/delete.
 */
import { prisma } from '@/lib/db';
import { getProjects } from '@/lib/content';
import { Badge } from '@/components/ui/Layout';
import { ProjectManager } from '@/components/admin/ProjectManager';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  let dbProjects: {
    id: string;
    slug: string;
    name: string;
    category: string;
    featured: boolean;
    active: boolean;
    liveUrl: string;
  }[] = [];
  let dbOk = true;
  try {
    dbProjects = await prisma.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        featured: true,
        active: true,
        liveUrl: true,
      },
    });
  } catch {
    dbOk = false;
  }

  // config fallback projects (not yet in DB) shown read-only until saved
  const publicProjects = await getProjects();
  const dbSlugs = new Set(dbProjects.map((p) => p.slug));
  const configOnly = publicProjects.filter((p) => !dbSlugs.has(p.slug));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage portfolio projects shown on /projects and the homepage.
        </p>
      </div>

      {!dbOk && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          Database unreachable — edits are unavailable until <code className="rounded bg-muted px-1">DATABASE_URL</code> is
          configured (<code className="rounded bg-muted px-1">npm run db:push</code>). Showing config defaults below.
        </div>
      )}

      <ProjectManager dbOk={dbOk} projects={dbProjects} />

      {configOnly.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Config projects (not yet in database)</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            These come from <code className="rounded bg-muted px-1">src/config/projects.ts</code> and appear on the
            public site. Saving them in the admin creates DB records that override the config.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {configOnly.map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                <span className="truncate font-medium">{p.name}</span>
                <Badge tone="accent">{p.category}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
