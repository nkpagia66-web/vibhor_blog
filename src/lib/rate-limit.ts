/**
 * In-memory fixed-window rate limiter for public form endpoints.
 *
 * Suitable for a single Node process (VPS / `next start`). On serverless
 * (Vercel) each instance keeps its own map, which still blunts abuse and
 * pairs well with Vercel's own per-IP firewall rules.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;

function getClientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Returns true when the request is allowed. Each call consumes one unit.
 * @param key bucket key, e.g. "lead" or "login"
 */
export function rateLimit(request: Request, key: string, maxPerMinute?: number): boolean {
  const max = maxPerMinute ?? Number(process.env.RATE_LIMIT_PER_MINUTE ?? 5);
  const ip = getClientIp(request);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();

  const bucket = buckets.get(bucketKey);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}

/** Periodically clear expired buckets to avoid unbounded growth. */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    buckets.forEach((b, k) => {
      if (b.resetAt <= now) buckets.delete(k);
    });
  }, WINDOW_MS * 2).unref?.();
}
