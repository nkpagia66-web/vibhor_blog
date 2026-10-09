/**
 * /blog — article list with client-side search and category filter.
 */
import { getPublishedPosts } from '@/lib/posts';
import { buildMetadata } from '@/lib/seo';
import { Section, Container } from '@/components/ui/Layout';
import { BlogBrowser } from '@/components/blog/BlogBrowser';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Blog — Web Development Notes & Guides',
  description:
    'Practical articles on website pricing, React and Next.js, performance, SEO and building scalable web applications — from a working developer’s desk.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  const cards = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    readingTimeMin: p.readingTimeMin,
    featured: p.featured,
  }));

  return (
    <>
      <Section size="lg" className="border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Blog</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Notes from the build log
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Practical writing on web development, pricing, and technology decisions — written from
              real project experience.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <BlogBrowser posts={cards} />
        </Container>
      </Section>
    </>
  );
}
