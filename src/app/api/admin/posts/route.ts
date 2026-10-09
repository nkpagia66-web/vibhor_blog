/**
 * /api/admin/posts — GET all posts, POST create (upsert by slug).
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSession, UnauthorizedError } from '@/lib/auth';
import { blogPostSchema } from '@/lib/validation';
import { readingTime } from '@/lib/utils';

async function guard() {
  try {
    await requireSession();
    return null;
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    throw e;
  }
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ ok: true, posts });
  } catch {
    return NextResponse.json({ ok: false, error: 'Database unavailable.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const post = await prisma.blogPost.upsert({
      where: { slug: data.slug },
      update: {
        ...data,
        readingTimeMin: readingTime(data.content),
        publishedAt: data.published ? new Date() : null,
      },
      create: {
        ...data,
        readingTimeMin: readingTime(data.content),
        publishedAt: data.published ? new Date() : null,
      },
    });
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not save post.' }, { status: 500 });
  }
}
