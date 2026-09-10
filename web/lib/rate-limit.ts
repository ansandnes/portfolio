/**
 * Fixed-window in-memory rate limiter.
 *
 * D7: single-instance only. State lives in this module's memory, so it resets on
 * every deploy/restart and is NOT shared across serverless instances. Adequate
 * for a personal site; swap for a Redis-backed limiter (e.g. @upstash/ratelimit)
 * if the app ever runs multi-instance.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets (only meaningful when `ok` is false). */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }

  if (bucket.count >= opts.limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, remaining: opts.limit - bucket.count, retryAfter: 0 };
}

/** Test seam: clear all buckets. */
export function __resetRateLimit(): void {
  buckets.clear();
}
