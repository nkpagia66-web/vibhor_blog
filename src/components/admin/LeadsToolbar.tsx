'use client';

/**
 * LeadsToolbar — server-refreshing search box + status filter pills.
 */
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';

const statuses = [
  { value: '', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_DISCUSSION', label: 'In discussion' },
  { value: 'PROPOSAL_SENT', label: 'Proposal sent' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
];

export function LeadsToolbar({ activeStatus, query }: { activeStatus: string; query: string }) {
  const router = useRouter();
  const [q, setQ] = useState(query);

  function go(status: string) {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (query) params.set('q', query);
    router.push(`/admin/leads?${params.toString()}`);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeStatus) params.set('status', activeStatus);
    if (q) params.set('q', q);
    router.push(`/admin/leads?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSearch} className="relative max-w-md">
        <Search
          size={15}
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email or business…"
          aria-label="Search leads"
          className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </form>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {statuses.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => go(s.value)}
            aria-pressed={activeStatus === s.value}
            className={
              activeStatus === s.value
                ? 'rounded-full border border-accent bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground'
                : 'rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-accent/50 hover:text-foreground'
            }
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
