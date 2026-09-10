import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * The Energy Bill Analyzer is deferred (REBUILD_PLAN.md §9 Phase 6, decision D3).
 * The Python service under services/energy/ is not deployed and its parsing is
 * still a stub, so this endpoint reports "not implemented". The browser only ever
 * talks to this route — never to the Python service directly.
 *
 * Build path: turn this into a proxy that validates the upload, forwards it to
 * ENERGY_SERVICE_URL with the X-Internal-Secret header, and streams the ZIP back.
 */
export function POST() {
  return NextResponse.json(
    { error: "The energy analyzer is planned but not available yet." },
    { status: 501 },
  );
}
