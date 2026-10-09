/**
 * Blog post accessors — DB-first with graceful degradation when the database
 * is not configured (returns [] so pages still render with empty states).
 */
import { prisma } from '@/lib/db';

export type PublishedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: Date | null;
  readingTimeMin: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

async function safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

const orderBy = { publishedAt: 'desc' } as const;

/** All published posts, newest first. */
export async function getPublishedPosts(): Promise<PublishedPost[]> {
  return safe(
    () =>
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          content: true,
          category: true,
          tags: true,
          coverImage: true,
          featured: true,
          published: true,
          publishedAt: true,
          readingTimeMin: true,
          metaTitle: true,
          metaDescription: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    [] as PublishedPost[],
  );
}

/** A single published post by slug. */
export async function getPostBySlug(slug: string): Promise<PublishedPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** Posts related by category or shared tags (excluding the current post). */
export async function getRelatedPosts(post: PublishedPost, limit = 3): Promise<PublishedPost[]> {
  const all = await getPublishedPosts();
  const others = all.filter((p) => p.slug !== post.slug);
  const score = (p: PublishedPost) =>
    (p.category === post.category ? 2 : 0) +
    p.tags.filter((t) => post.tags.includes(t)).length;
  return others
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}

/** Distinct categories with counts, for the blog filter bar. */
export async function getPostCategories(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}
