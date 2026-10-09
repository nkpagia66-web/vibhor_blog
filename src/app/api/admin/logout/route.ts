/**
 * POST /api/admin/logout — clears the admin session cookie.
 */
import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
