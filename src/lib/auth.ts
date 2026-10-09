/**
 * Admin authentication — HMAC-signed session cookies.
 *
 * - Credentials come from env vars (ADMIN_EMAIL / ADMIN_PASSWORD or
 *   ADMIN_PASSWORD_HASH) so no secrets live in the repo.
 * - The session cookie is an HMAC-SHA256-signed JSON payload using AUTH_SECRET;
 *   it cannot be forged without the secret.
 * - Passwords are compared in constant time.
 *
 * This is intentionally dependency-free (node:crypto only).
 */
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'va_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  sub: string; // admin identity (email)
  iat: number;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET is missing or too short (min 32 chars). See .env.example.');
  }
  return secret;
}

function hmac(input: string): string {
  return createHmac('sha256', getSecret()).update(input).digest('base64url');
}

/** Sign a session token: base64url(json).signature */
export function signSession(payload: Omit<SessionPayload, 'iat' | 'exp'>): string {
  const now = Date.now();
  const body: SessionPayload = { ...payload, iat: now, exp: now + SESSION_TTL_MS };
  const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
  return `${encoded}.${hmac(encoded)}`;
}

/** Verify a session token; returns the payload or null if invalid/expired. */
export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = hmac(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** True when env credentials are configured for the admin login. */
export function hasAdminCredentials(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH));
}

/** Constant-time credential check against env vars. */
export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;

  const emailOk = timingSafeEqualBuffer(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());

  let passwordOk = false;
  const plain = process.env.ADMIN_PASSWORD;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (plain) {
    passwordOk = timingSafeEqualBuffer(password, plain);
  } else if (hash && hash.startsWith('scrypt$')) {
    const [, saltHex, hashHex] = hash.split('$');
    if (saltHex && hashHex) {
      const derived = scryptSync(password, Buffer.from(saltHex, 'hex'), 64).toString('hex');
      passwordOk = timingSafeEqualBuffer(derived, hashHex);
    }
  }
  return emailOk && passwordOk;
}

function timingSafeEqualBuffer(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    // still compare to keep timing uniform-ish
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

/** Generate a scrypt password hash (for ADMIN_PASSWORD_HASH). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

/** Set the session cookie (call inside a route handler / server action). */
export async function setSessionCookie(email: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, signSession({ sub: email }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Read and verify the current session (server components / route handlers). */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(COOKIE_NAME)?.value);
}

/** Require a valid session; throws Response-style 401 for API callers. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}
