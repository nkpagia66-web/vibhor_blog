'use client';

/**
 * ProjectManager — create/edit/delete projects via /api/admin/projects.
 */
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Field, Input, Textarea, Select } from '@/components/ui/Form';
import { Badge } from '@/components/ui/Layout';

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  featured: boolean;
  active: boolean;
  liveUrl: string;
};

type Draft = {
  id?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  longDescription: string;
  liveUrl: string;
  githubUrl: string;
  image: string;
  technologies: string; // comma-separated
  features: string; // one per line
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

const emptyDraft: Draft = {
  name: '',
  slug: '',
  category: 'Websites',
  description: '',
  longDescription: '',
  liveUrl: 'https://',
  githubUrl: '',
  image: '',
  technologies: '',
  features: '',
  featured: false,
  active: true,
  sortOrder: 0,
};

function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function ProjectManager({
  dbOk,
  projects,
}: {
  dbOk: boolean;
  projects: ProjectRow[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError('');
    try {
      const payload = {
        name: draft.name,
        slug: draft.slug || slugify(draft.name),
        category: draft.category,
        description: draft.description,
        longDescription: draft.longDescription || null,
        liveUrl: draft.liveUrl,
        githubUrl: draft.githubUrl || null,
        image: draft.image || null,
        technologies: draft.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        features: draft.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        featured: draft.featured,
        active: draft.active,
        sortOrder: Number(draft.sortOrder) || 0,
        caseStudy: null,
      };
      const res = await fetch(draft.id ? `/api/admin/projects/${draft.id}` : '/api/admin/projects', {
        method: draft.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Could not save project.');
      setDraft(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save project.');
    } finally {
      setBusy(false);
    }
  }

  async function openEdit(p: ProjectRow) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error('Could not load project.');
      const full = (data.projects as (ProjectRow & {
        description: string;
        longDescription: string | null;
        githubUrl: string | null;
        image: string | null;
        technologies: string[];
        features: string[];
        sortOrder: number;
      })[]).find((x) => x.id === p.id);
      if (!full) throw new Error('Project not found.');
      setDraft({
        id: full.id,
        name: full.name,
        slug: full.slug,
        category: full.category,
        description: full.description,
        longDescription: full.longDescription ?? '',
        liveUrl: full.liveUrl,
        githubUrl: full.githubUrl ?? '',
        image: full.image ?? '',
        technologies: full.technologies.join(', '),
        features: full.features.join('\n'),
        featured: full.featured,
        active: full.active,
        sortOrder: full.sortOrder,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load project.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!dbOk}
          onClick={() => setDraft({ ...emptyDraft })}
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Plus size={15} aria-hidden /> New project
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {projects.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No projects in the database yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.liveUrl}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <Badge tone="accent">{p.category}</Badge>
                  {p.featured && <Badge tone="warning">Featured</Badge>}
                  {!p.active && <Badge tone="danger">Hidden</Badge>}
                  <button
                    type="button"
                    disabled={!dbOk || busy}
                    onClick={() => openEdit(p)}
                    className="rounded-lg border border-border p-1.5 transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
                    aria-label={`Edit ${p.name}`}
                  >
                    <Pencil size={14} aria-hidden />
                  </button>
                  <button
                    type="button"
                    disabled={!dbOk || busy}
                    onClick={() => remove(p.id, p.name)}
                    className="rounded-lg border border-border p-1.5 transition-colors hover:border-danger/50 hover:text-danger disabled:opacity-40"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* editor drawer */}
      {draft && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={draft.id ? 'Edit project' : 'New project'}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-card sm:rounded-3xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                {draft.id ? 'Edit project' : 'New project'}
              </h2>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-lg p-1.5 hover:bg-muted"
                aria-label="Close editor"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" htmlFor="p-name" required>
                  <Input
                    id="p-name"
                    required
                    value={draft.name}
                    onChange={(e) => {
                      set('name', e.target.value);
                      if (!draft.id) set('slug', slugify(e.target.value));
                    }}
                  />
                </Field>
                <Field label="Slug" htmlFor="p-slug" required hint="URL: /projects/your-slug">
                  <Input
                    id="p-slug"
                    required
                    value={draft.slug}
                    onChange={(e) => set('slug', e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category" htmlFor="p-cat">
                  <Select id="p-cat" value={draft.category} onChange={(e) => set('category', e.target.value)}>
                    {['Websites', 'E-commerce', 'Web Applications', 'Mobile', 'Other'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Live URL" htmlFor="p-url" required>
                  <Input id="p-url" type="url" required value={draft.liveUrl} onChange={(e) => set('liveUrl', e.target.value)} />
                </Field>
              </div>

              <Field label="Short description" htmlFor="p-desc" required>
                <Textarea
                  id="p-desc"
                  required
                  rows={3}
                  maxLength={600}
                  value={draft.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </Field>

              <Field label="Long description (detail page)" htmlFor="p-long">
                <Textarea id="p-long" rows={4} value={draft.longDescription} onChange={(e) => set('longDescription', e.target.value)} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Technologies" htmlFor="p-tech" hint="Comma separated: React, Next.js">
                  <Input id="p-tech" value={draft.technologies} onChange={(e) => set('technologies', e.target.value)} />
                </Field>
                <Field label="Image path" htmlFor="p-img" hint="e.g. /projects/site.png (upload to /public)">
                  <Input id="p-img" value={draft.image} onChange={(e) => set('image', e.target.value)} />
                </Field>
              </div>

              <Field label="Key features" htmlFor="p-feat" hint="One per line">
                <Textarea id="p-feat" rows={4} value={draft.features} onChange={(e) => set('features', e.target.value)} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => set('featured', e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--accent))]"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) => set('active', e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--accent))]"
                  />
                  Visible
                </label>
                <Field label="Sort order" htmlFor="p-sort">
                  <Input
                    id="p-sort"
                    type="number"
                    min={0}
                    value={draft.sortOrder}
                    onChange={(e) => set('sortOrder', Number(e.target.value))}
                  />
                </Field>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? 'Saving…' : 'Save project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
