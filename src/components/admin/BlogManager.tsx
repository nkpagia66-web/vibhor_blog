'use client';

/**
 * BlogManager — create/edit/delete posts via /api/admin/posts.
 * Full editor: title, slug, excerpt, markdown body, tags, SEO, publish state.
 */
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Field, Input, Textarea, Select } from '@/components/ui/Form';
import { Badge } from '@/components/ui/Layout';
import { formatDate } from '@/lib/utils';

type PostRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  featured: boolean;
  publishedAt: Date | null;
  readingTimeMin: number;
};

type Draft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  coverImage: string;
  featured: boolean;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
};

const emptyDraft: Draft = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'General',
  tags: '',
  coverImage: '',
  featured: false,
  published: false,
  metaTitle: '',
  metaDescription: '',
};

function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function BlogManager({ dbOk, posts }: { dbOk: boolean; posts: PostRow[] }) {
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
        title: draft.title,
        slug: draft.slug || slugify(draft.title),
        excerpt: draft.excerpt,
        content: draft.content,
        category: draft.category,
        tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
        coverImage: draft.coverImage || null,
        featured: draft.featured,
        published: draft.published,
        metaTitle: draft.metaTitle || null,
        metaDescription: draft.metaDescription || null,
      };
      const res = await fetch(draft.id ? `/api/admin/posts/${draft.id}` : '/api/admin/posts', {
        method: draft.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Could not save post.');
      setDraft(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save post.');
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(post: PostRow) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!res.ok) throw new Error('Could not update.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(post: PostRow) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete.');
    } finally {
      setBusy(false);
    }
  }

  async function openEdit(post: PostRow) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/posts');
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error('Could not load post.');
      const full = (data.posts as (PostRow & {
        excerpt: string;
        content: string;
        tags: string[];
        coverImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
      })[]).find((p) => p.id === post.id);
      if (!full) throw new Error('Post not found.');
      setDraft({
        id: full.id,
        title: full.title,
        slug: full.slug,
        excerpt: full.excerpt,
        content: full.content,
        category: full.category,
        tags: full.tags.join(', '),
        coverImage: full.coverImage ?? '',
        featured: full.featured,
        published: full.published,
        metaTitle: full.metaTitle ?? '',
        metaDescription: full.metaDescription ?? '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load post.');
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
          <Plus size={15} aria-hidden /> New post
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {posts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            {dbOk ? 'No posts yet — create your first article.' : 'Posts unavailable without a database.'}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium">{post.title}</span>
                    <Badge tone={post.published ? 'success' : 'default'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                    {post.featured && <Badge tone="warning">Featured</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    /blog/{post.slug} · {post.category} · {post.readingTimeMin} min
                    {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={!dbOk || busy}
                    onClick={() => togglePublished(post)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
                  >
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    disabled={!dbOk || busy}
                    onClick={() => openEdit(post)}
                    className="rounded-lg border border-border p-1.5 transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
                    aria-label={`Edit ${post.title}`}
                  >
                    <Pencil size={14} aria-hidden />
                  </button>
                  <button
                    type="button"
                    disabled={!dbOk || busy}
                    onClick={() => remove(post)}
                    className="rounded-lg border border-border p-1.5 transition-colors hover:border-danger/50 hover:text-danger disabled:opacity-40"
                    aria-label={`Delete ${post.title}`}
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* editor */}
      {draft && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={draft.id ? 'Edit post' : 'New post'}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-card sm:rounded-3xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{draft.id ? 'Edit post' : 'New post'}</h2>
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
              <Field label="Title" htmlFor="b-title" required>
                <Input
                  id="b-title"
                  required
                  value={draft.title}
                  onChange={(e) => {
                    set('title', e.target.value);
                    if (!draft.id) set('slug', slugify(e.target.value));
                  }}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Slug" htmlFor="b-slug" required hint="/blog/your-slug">
                  <Input id="b-slug" required value={draft.slug} onChange={(e) => set('slug', e.target.value)} />
                </Field>
                <Field label="Category" htmlFor="b-cat">
                  <Input id="b-cat" value={draft.category} onChange={(e) => set('category', e.target.value)} />
                </Field>
              </div>

              <Field label="Excerpt" htmlFor="b-excerpt" required hint="Shown in listings and meta description">
                <Textarea id="b-excerpt" rows={2} maxLength={400} required value={draft.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
              </Field>

              <Field label="Content (Markdown)" htmlFor="b-content" required>
                <Textarea
                  id="b-content"
                  rows={14}
                  required
                  className="font-mono text-xs"
                  value={draft.content}
                  onChange={(e) => set('content', e.target.value)}
                  placeholder={'# Heading\n\nParagraph text with **bold** and [links](https://…).'}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tags" htmlFor="b-tags" hint="Comma separated">
                  <Input id="b-tags" value={draft.tags} onChange={(e) => set('tags', e.target.value)} />
                </Field>
                <Field label="Cover image path" htmlFor="b-cover" hint="/blog/image.png">
                  <Input id="b-cover" value={draft.coverImage} onChange={(e) => set('coverImage', e.target.value)} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Meta title (optional)" htmlFor="b-meta-title" hint="Max 70 chars">
                  <Input id="b-meta-title" maxLength={70} value={draft.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} />
                </Field>
                <Field label="Meta description (optional)" htmlFor="b-meta-desc" hint="Max 170 chars">
                  <Input id="b-meta-desc" maxLength={170} value={draft.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} />
                </Field>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => set('published', e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--accent))]"
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => set('featured', e.target.checked)}
                    className="h-4 w-4 accent-[rgb(var(--accent))]"
                  />
                  Featured
                </label>
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
                  {busy ? 'Saving…' : 'Save post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
