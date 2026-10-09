/**
 * /api/admin/leads — GET list (with search/filter), used by the admin UI.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSession, UnauthorizedError } from '@/lib/auth';
import { leadFilterSchema } from '@/lib/validation';

export async function GET(request: Request) {
  try {
    await requireSession();
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    throw e;
  }

  const url = new URL(request.url);
  const filters = leadFilterSchema.safeParse({
    status: url.searchParams.get('status') ?? undefined,
    q: url.searchParams.get('q') ?? undefined,
  });

  const where = {
    ...(filters.success && filters.data.status ? { status: filters.data.status } : {}),
    ...(filters.success && filters.data.q
      ? {
          OR: [
            { name: { contains: filters.data.q, mode: 'insensitive' as const } },
            { email: { contains: filters.data.q, mode: 'insensitive' as const } },
            { businessName: { contains: filters.data.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  try {
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { notes: { orderBy: { createdAt: 'desc' } } },
    });
    return NextResponse.json({ ok: true, leads });
  } catch (err) {
    console.error('[admin/leads] query failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: 'Database unavailable.' }, { status: 503 });
  }
}
