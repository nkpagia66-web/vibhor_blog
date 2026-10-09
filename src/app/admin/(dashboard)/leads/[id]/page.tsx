/**
 * /admin/leads/[id] — lead detail with status update, notes and delete.
 */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { prisma } from '@/lib/db';
import { Badge, Section } from '@/components/ui/Layout';
import { formatDate } from '@/lib/utils';
import { LeadActions } from '@/components/admin/LeadActions';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

const statusLabel: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_DISCUSSION: 'In discussion',
  PROPOSAL_SENT: 'Proposal sent',
  WON: 'Won',
  LOST: 'Lost',
};

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;

  let lead:
    | {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        businessName: string | null;
        website: string | null;
        projectType: string | null;
        budget: string | null;
        message: string;
        source: string;
        status: string;
        details: unknown;
        createdAt: Date;
        notes: { id: string; body: string; createdAt: Date }[];
      }
    | null = null;

  try {
    lead = await prisma.lead.findUnique({
      where: { id },
      include: { notes: { orderBy: { createdAt: 'desc' } } },
    });
  } catch {
    lead = null;
  }

  if (!lead) notFound();

  const waMessage = `Hi ${lead.name.split(' ')[0]}, thanks for reaching out about your ${
    lead.projectType ?? 'website'
  } project.`;

  const details =
    lead.details && typeof lead.details === 'object' ? (lead.details as Record<string, unknown>) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} aria-hidden /> All leads
          </Link>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">{lead.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lead.businessName ? `${lead.businessName} · ` : ''}
            Received {formatDate(lead.createdAt)}
          </p>
        </div>
        <Badge
          tone={
            lead.status === 'WON'
              ? 'success'
              : lead.status === 'NEW'
                ? 'accent'
                : lead.status === 'LOST'
                  ? 'danger'
                  : 'warning'
          }
        >
          {statusLabel[lead.status] ?? lead.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* main */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Message
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{lead.message}</p>
          </div>

          {details && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Calculator selections
              </h2>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {Object.entries(details).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-border pb-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">
                      {Array.isArray(v) ? v.join(', ') : String(v)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Notes
            </h2>
            {lead.notes.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {lead.notes.map((note) => (
                  <li key={note.id} className="rounded-xl bg-muted/60 p-4">
                    <p className="whitespace-pre-wrap text-sm">{note.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No notes yet.</p>
            )}
          </div>

          <LeadActions leadId={lead.id} />
        </div>

        {/* sidebar */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd>
                  <a href={`mailto:${lead.email}`} className="break-all font-medium hover:text-accent">
                    {lead.email}
                  </a>
                </dd>
              </div>
              {lead.phone && (
                <div>
                  <dt className="text-xs text-muted-foreground">Phone</dt>
                  <dd className="font-medium">{lead.phone}</dd>
                </div>
              )}
              {lead.website && (
                <div>
                  <dt className="text-xs text-muted-foreground">Website</dt>
                  <dd>
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all font-medium text-accent hover:underline"
                    >
                      {lead.website}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-muted-foreground">Project type</dt>
                <dd className="font-medium">{lead.projectType || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Budget</dt>
                <dd className="font-medium">{lead.budget || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Source</dt>
                <dd className="font-medium">{lead.source}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick actions
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent(
                  `Re: your ${lead.projectType ?? 'website'} enquiry`,
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-accent/50 hover:text-accent"
              >
                <Mail size={15} aria-hidden /> Reply by email
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-[#0b3d21] transition-all hover:brightness-95"
              >
                <MessageCircle size={15} aria-hidden /> Open on WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
