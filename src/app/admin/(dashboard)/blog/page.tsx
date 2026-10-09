/**
 * /admin/blog — blog post list with create/edit/delete and publish toggle.
 */
import { prisma } from '@/lib/db';
import { BlogManager } from '@/components/admin/BlogManager';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  let posts: {
    id: string;
    slug: string;
    title: string;
    category: string;
    published: boolean;
    featured: boolean;
    publishedAt: Date | null;
    readingTimeMin: number;
  }[] = [];
  let dbOk = true;
  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        published: true,
        featured: true,
        publishedAt: true,
        readingTimeMin: true,
      },
    });
  } catch {
    dbOk = false;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Blog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write, edit, publish and unpublish articles. Markdown is supported in the content field.
        </p>
      </div>

      {!dbOk && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          Database unreachable — configure{' '}
          <code className="rounded bg-muted px-1">DATABASE_URL</code> and run{' '}
          <code className="rounded bg-muted px-1">npm run db:push</code>, then run{' '}
          <code className="rounded bg-muted px-1">npm run db:seed</code> for starter posts.
        </div>
      )}

      <BlogManager dbOk={dbOk} posts={posts} />
    </div>
  );
}
