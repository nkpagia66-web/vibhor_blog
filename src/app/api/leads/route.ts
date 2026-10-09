/**
 * POST /api/leads — public lead capture (contact form, request-website,
 * quote calculator submissions).
 *
 * Security: zod validation, honeypot field, per-IP rate limiting.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createLeadSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { track } from '@/lib/analytics';

export async function POST(request: Request) {
  if (!rateLimit(request, 'lead')) {
    return NextResponse.json(
      { ok: false, error: 'Too many submissions. Please wait a minute and try again.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = createLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot filled → pretend success, store nothing.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        website: data.website,
        projectType: data.projectType,
        budget: data.budget,
        message: data.message,
        source: data.source,
        details: data.details ? JSON.parse(JSON.stringify(data.details)) : undefined,
      },
    });
  } catch (err) {
    // DB not configured/unreachable — surface a clear, non-leaky error.
    console.error('[leads] create failed:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      {
        ok: false,
        error:
          'The form could not be saved right now. Please WhatsApp or email me directly — links are on this page.',
      },
      { status: 503 },
    );
  }

  track('contact_form_submitted', { source: data.source });

  return NextResponse.json({ ok: true });
}
