'use client';

/**
 * BlogBrowser — search box + category pills + post grid (client-filtered).
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight, X } from 'lucide-react';
import { Badge } from '@/components/ui/Layout';
import { formatDate } from '@/lib/utils';

export type BlogCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string | null;
  readingTimeMin: number;
  featured: boolean;
};

export function BlogBrowser({ posts }: { posts: BlogCard[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((p) => p.category))).sort()],
    [posts],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, category]);

  if (posts.length === 0) {
    return (
      <div className="card p-12 text-center">
        <h2 className="font-display text-xl font-bold">Articles are on the way</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The blog is being set up — new articles will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* search + filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X size={15} aria-hidden />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={
                category === c
                  ? 'rounded-full border border-accent bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground'
                  : 'rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground hover:border-accent/50 hover:text-foreground'
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No articles match “{query}”. Try a different search.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-card"
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge tone="accent">{post.category}</Badge>
                  {post.featured && <Badge tone="warning">Featured</Badge>}
                </div>
                <h2 className="mt-4 font-display text-lg font-bold leading-6">
                  <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} aria-hidden /> {post.readingTimeMin} min read
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:opacity-80"
                >
                  Read article <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
