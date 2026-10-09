/**
 * /api/admin/projects/[id] — PATCH update, DELETE.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSession, UnauthorizedError } from '@/lib/auth';
import { projectSchema } from '@/lib/validation';

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
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { ...parsed.data, caseStudy: parsed.data.caseStudy ?? undefined },
    });
    return NextResponse.json({ ok: true, project });
  } catch {
    return NextResponse.json({ ok: false, error: 'Project not found.' }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Project not found.' }, { status: 404 });
  }
}
