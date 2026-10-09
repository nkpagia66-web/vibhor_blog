/**
 * /blog/[slug] — article page: markdown body, tags, reading time, related
 * posts, social sharing and Article/JSON-LD metadata.
 */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, CalendarDays } from 'lucide-react';
import { getPublishedPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { renderMarkdown } from '@/lib/markdown';
import { absoluteUrl, buildMetadata, JsonLd, articleJsonLd } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { formatDate } from '@/lib/utils';
import { Section, Container, Badge } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { ShareButtons } from '@/components/blog/ShareButtons';
import type { Metadata } from 'next';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article not found' };
  return buildMetadata({
    title: post.metaTitle ?? `${post.title} | ${siteConfig.shortName} Blog`,
    description: post.metaDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);
  const html = renderMarkdown(post.content);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <>
      <JsonLd
        data={{
          ...articleJsonLd(post),
          wordCount: post.content.split(/\s+/).length,
          keywords: post.tags.join(', '),
        }}
      />

      <article>
        <Section size="sm" className="border-b border-border">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Button href="/blog" variant="ghost" size="sm" className="-ml-3 mb-6">
                <ArrowLeft size={16} aria-hidden /> All articles
              </Button>

              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone="accent">{post.category}</Badge>
                {post.tags.slice(0, 4).map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>

              <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <p className="mt-4 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{siteConfig.name}</span>
                {post.publishedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={15} aria-hidden />
                    <time dateTime={new Date(post.publishedAt).toISOString()}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={15} aria-hidden /> {post.readingTimeMin} min read
                </span>
              </div>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="prose-site" dangerouslySetInnerHTML={{ __html: html }} />

              <div className="mt-10 border-t border-border pt-6">
                <ShareButtons title={post.title} url={url} />
              </div>
            </div>
          </Container>
        </Section>
      </article>

      {related.length > 0 && (
        <Section className="border-t border-border bg-card/40">
          <Container>
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl font-bold tracking-tight">Related articles</h2>
                <Button href="/blog" variant="outline" size="sm">
                  All articles
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-accent/40"
                  >
                    <Badge tone="accent" className="self-start">
                      {p.category}
                    </Badge>
                    <h3 className="mt-4 font-display text-base font-bold leading-6 group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      Read <ArrowRight size={14} aria-hidden />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
