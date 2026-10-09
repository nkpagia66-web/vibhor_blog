/**
 * /admin/leads — searchable, filterable lead list.
 */
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/Layout';
import { formatDate } from '@/lib/utils';
import { LeadsToolbar } from '@/components/admin/LeadsToolbar';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

const statusTone: Record<string, 'default' | 'accent' | 'success' | 'warning' | 'danger'> = {
  NEW: 'accent',
  CONTACTED: 'default',
  IN_DISCUSSION: 'warning',
  PROPOSAL_SENT: 'warning',
  WON: 'success',
  LOST: 'danger',
};

const statusLabel: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_DISCUSSION: 'In discussion',
  PROPOSAL_SENT: 'Proposal sent',
  WON: 'Won',
  LOST: 'Lost',
};

export default async function AdminLeadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status ?? '';
  const q = (params.q ?? '').trim();

  let leads: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    businessName: string | null;
    projectType: string | null;
    status: string;
    source: string;
    createdAt: Date;
  }[] = [];
  let dbOk = true;

  try {
    leads = await prisma.lead.findMany({
      where: {
        ...(status ? { status: status as never } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { businessName: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        businessName: true,
        projectType: true,
        status: true,
        source: true,
        createdAt: true,
      },
    });
  } catch {
    dbOk = false;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every enquiry from the contact form, request page and calculator.
        </p>
      </div>

      <LeadsToolbar activeStatus={status} query={q} />

      {!dbOk && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          Database unreachable — configure <code className="rounded bg-muted px-1">DATABASE_URL</code> and run{' '}
          <code className="rounded bg-muted px-1">npm run db:push</code>.
        </div>
      )}

      {dbOk && leads.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {q || status ? 'No leads match these filters.' : 'No leads yet — submissions will appear here.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Contact</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Project</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="font-medium text-accent hover:underline">
                        {lead.name}
                      </Link>
                      {lead.businessName && (
                        <span className="block text-xs text-muted-foreground">{lead.businessName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${lead.email}`} className="block text-xs hover:text-accent">
                        {lead.email}
                      </a>
                      {lead.phone && <span className="block text-xs text-muted-foreground">{lead.phone}</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{lead.projectType || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{lead.source}</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[lead.status] ?? 'default'}>
                        {statusLabel[lead.status] ?? lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
