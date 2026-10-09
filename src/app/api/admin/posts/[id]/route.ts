/**
 * /api/admin/posts/[id] — PATCH update, DELETE post.
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }
  const parsed = blogPostSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Post not found.' }, { status: 404 });
    }
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        ...(data.content ? { readingTimeMin: readingTime(data.content) } : {}),
        // set publishedAt when transitioning to published
        ...(data.published === true && !existing.publishedAt ? { publishedAt: new Date() } : {}),
      },
    });
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not update post.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Post not found.' }, { status: 404 });
  }
}
