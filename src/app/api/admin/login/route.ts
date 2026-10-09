/**
 * POST /api/admin/login — env-credential admin auth, sets signed session cookie.
 * POST (via logout route) clears it.
 */
import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { verifyCredentials, hasAdminCredentials, setSessionCookie } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  if (!hasAdminCredentials()) {
    return NextResponse.json(
      { ok: false, error: 'Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.' },
      { status: 503 },
    );
  }

  if (!rateLimit(request, 'login', 5)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Try again in a minute.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Enter a valid email and password.' }, { status: 400 });
  }

  const { email, password } = parsed.data;
  if (!verifyCredentials(email, password)) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 });
  }

  await setSessionCookie(email);
  return NextResponse.json({ ok: true });
}
