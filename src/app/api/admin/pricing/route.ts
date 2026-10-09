/**
 * /api/admin/pricing — GET all plans, POST create, PATCH by ?slug=.
 * Pricing edits upsert by slug so config defaults get overridden in the DB.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSession, UnauthorizedError } from '@/lib/auth';
import { pricingPlanSchema } from '@/lib/validation';

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
    const plans = await prisma.pricingPlan.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json({ ok: true, plans });
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
  const parsed = pricingPlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 400 },
    );
  }

  try {
    const plan = await prisma.pricingPlan.upsert({
      where: { slug: parsed.data.slug },
      update: parsed.data,
      create: parsed.data,
    });
    return NextResponse.json({ ok: true, plan });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not save plan.' }, { status: 500 });
  }
}
