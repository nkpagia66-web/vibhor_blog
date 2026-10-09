/**
 * /api/admin/projects — GET all (incl. inactive), POST create.
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

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  try {
    const projects = await prisma.project.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
    return NextResponse.json({ ok: true, projects });
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
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.project.create({
      data: { ...parsed.data, caseStudy: parsed.data.caseStudy ?? undefined },
    });
    return NextResponse.json({ ok: true, project });
  } catch {
    return NextResponse.json({ ok: false, error: 'Slug already exists.' }, { status: 409 });
  }
}
