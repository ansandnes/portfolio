import { NextResponse, type NextRequest } from "next/server";
import { generateRecipe } from "@/lib/gemini";
import { clientKey, isSameOrigin } from "@/lib/http";
import { log } from "@/lib/log";
import { rateLimit } from "@/lib/rate-limit";
import { recipeRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const limit = rateLimit(`recipe:${clientKey(req)}`, { limit: 10, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = recipeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const data = await generateRecipe(parsed.data.prompt);
    return NextResponse.json({ data });
  } catch (err) {
    log.error("recipe generation failed", err);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 502 });
  }
}
