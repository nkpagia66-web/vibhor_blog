'use client';

/**
 * LeadActions — status selector, note form and delete button.
 */
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus } from 'lucide-react';

const statuses = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_DISCUSSION', label: 'In discussion' },
  { value: 'PROPOSAL_SENT', label: 'Proposal sent' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
];

export function LeadActions({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  async function updateStatus(status: string) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Could not update status.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update status.');
    } finally {
      setSaving(false);
    }
  }

  async function addNote(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: note.trim() }),
      });
      if (!res.ok) throw new Error('Could not save note.');
      setNote('');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save note.');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm('Delete this lead permanently? This cannot be undone.')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete lead.');
      router.push('/admin/leads');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete lead.');
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pipeline status
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s.value}
              type="button"
              disabled={saving}
              onClick={() => updateStatus(s.value)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>
        {error && (
          <p className="mt-3 text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={addNote} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <label htmlFor="note" className="text-sm font-semibold">
          Add a note
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Called, discussed requirements…"
          className="mt-3 w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={saving || !note.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={14} aria-hidden /> Save note
          </button>
        </div>
      </form>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={remove}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl border border-danger/40 px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
        >
          <Trash2 size={14} aria-hidden /> Delete lead
        </button>
      </div>
    </div>
  );
}
