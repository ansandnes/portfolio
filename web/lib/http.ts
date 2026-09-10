import type { NextRequest } from "next/server";

/**
 * Extra origins allowed to call the API routes, comma-separated.
 * Same-origin requests are always allowed; this is for preview deployments etc.
 * e.g. ALLOWED_ORIGINS="https://portfolio.example.com,https://*.vercel.app"
 */
const EXTRA_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function matchesPattern(origin: string, pattern: string): boolean {
  if (pattern === origin) return true;
  if (pattern.includes("*")) {
    const re = new RegExp(
      "^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^.]+") + "$",
    );
    return re.test(origin);
  }
  return false;
}

/**
 * Reject cross-site calls to our JSON APIs. Browsers attach an `Origin` header to
 * cross-origin (and same-origin) POSTs; server-to-server callers won't. We allow:
 *  - Origin whose host equals the request host (same-origin), or
 *  - Origin in ALLOWED_ORIGINS, or
 *  - no Origin but a Referer whose host equals the request host.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (host && originHost === host) return true;
    } catch {
      return false;
    }
    return EXTRA_ORIGINS.some((p) => matchesPattern(origin, p));
  }

  const referer = req.headers.get("referer");
  if (referer && host) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  return false;
}

/** Best-effort client identifier for rate-limiting. */
export function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
