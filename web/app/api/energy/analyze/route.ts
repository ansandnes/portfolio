import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Placeholder. Phase 6 replaces this with a proxy to the Python energy-analysis
 * service (validate upload -> forward with a shared secret -> stream the ZIP
 * back). Until then the feature is unavailable; the client never talks to the
 * Python service directly.
 */
export function POST() {
  return NextResponse.json(
    { error: "The energy analyzer is not available yet." },
    { status: 501 },
  );
}
