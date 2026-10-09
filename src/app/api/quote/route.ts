/**
 * POST /api/quote — server-side quote estimation using the same centralized
 * rules as the client calculator (single source of truth).
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateEstimate, calculatorConfig } from '@/config/calculator';
import { rateLimit } from '@/lib/rate-limit';

const inputSchema = z.object({
  websiteType: z.string().min(1),
  pages: z.number().int().min(1).max(100),
  features: z.array(z.string()).max(30),
  support: z.string().min(1),
});

export async function POST(request: Request) {
  if (!rateLimit(request, 'quote', 30)) {
    return NextResponse.json({ ok: false, error: 'Too many requests.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid calculator input.' }, { status: 400 });
  }

  const result = calculateEstimate(parsed.data);
  return NextResponse.json({ ok: true, result, disclaimer: calculatorConfig.disclaimer });
}
