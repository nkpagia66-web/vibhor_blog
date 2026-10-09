/**
 * /admin — dashboard overview with lead/project/post counts and pipeline.
 */
import Link from 'next/link';
import { Inbox, FolderKanban, FileText, ArrowUpRight, Calculator } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getProjects } from '@/lib/content';
import { Badge } from '@/components/ui/Layout';
import { formatDate } from '@/lib/utils';

async function getStats() {
  try {
    const [totalLeads, newLeads, websiteRequests, posts, recentLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { source: { in: ['request-website', 'calculator'] } } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { id: true, name: true, projectType: true, status: true, createdAt: true },
      }),
    ]);
    const projects = await getProjects();
    return {
      dbOk: true,
      totalLeads,
      newLeads,
      websiteRequests,
      projectCount: projects.length,
      postCount: posts,
      recentLeads,
    };
  } catch {
    return {
      dbOk: false,
      totalLeads: 0,
      newLeads: 0,
      websiteRequests: 0,
      projectCount: 0,
      postCount: 0,
      recentLeads: [] as {
        id: string;
        name: string;
        projectType: string | null;
        status: string;
        createdAt: Date;
      }[],
    };
  }
}

const statusLabel: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_DISCUSSION: 'In discussion',
  PROPOSAL_SENT: 'Proposal sent',
  WON: 'Won',
  LOST: 'Lost',
};

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Leads', value: stats.totalLeads, href: '/admin/leads', icon: Inbox },
    { label: 'New Leads', value: stats.newLeads, href: '/admin/leads?status=NEW', icon: Inbox },
    { label: 'Website Requests', value: stats.websiteRequests, href: '/admin/leads', icon: Calculator },
    { label: 'Projects', value: stats.projectCount, href: '/admin/projects', icon: FolderKanban },
    { label: 'Blog Posts', value: stats.postCount, href: '/admin/blog', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of leads, projects and content.</p>
      </div>

      {!stats.dbOk && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <strong className="font-semibold">Database not reachable.</strong>{' '}
          Counts are unavailable until <code className="rounded bg-muted px-1">DATABASE_URL</code> is
          configured and migrations are pushed (<code className="rounded bg-muted px-1">npm run db:push</code>
          ).
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/40"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <card.icon size={17} aria-hidden />
            </span>
            <p className="mt-4 font-display text-3xl font-bold tabular-nums">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Recent leads</h2>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80"
          >
            View all <ArrowUpRight size={14} aria-hidden />
          </Link>
        </div>
        {stats.recentLeads.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No leads yet. They will appear here when the contact form receives submissions.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {stats.recentLeads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{lead.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {lead.projectType || 'General enquiry'} · {formatDate(lead.createdAt)}
                    </span>
                  </span>
                  <Badge
                    tone={
                      lead.status === 'WON'
                        ? 'success'
                        : lead.status === 'NEW'
                          ? 'accent'
                          : lead.status === 'LOST'
                            ? 'danger'
                            : 'default'
                    }
                  >
                    {statusLabel[lead.status] ?? lead.status}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
