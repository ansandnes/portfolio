import { z } from "zod";

/**
 * Centralised, validated access to environment variables.
 *
 * Nothing imports this yet — Phase 2 wires the AI route handlers and the energy
 * proxy through `serverEnv()` / `clientEnv`. It is added now so the schema and
 * its tests exist as part of the foundation.
 *
 * Rules:
 *  - Server-only secrets (no `NEXT_PUBLIC_` prefix) must never be read from
 *    Client Components. Access them through `serverEnv()`.
 *  - Client-exposed values (`NEXT_PUBLIC_*`) are inlined by Next at build time
 *    and are safe to read anywhere via `clientEnv`.
 */

const serverSchema = z.object({
  /** Google Gemini API key — used only by server-side AI route handlers. */
  API_KEY_GEMINI: z.string().min(1, "API_KEY_GEMINI is required").optional(),
  /** Base URL of the Python energy service. Reserved for the Phase 6 build path. */
  ENERGY_SERVICE_URL: z.string().url().optional(),
  /** Shared secret between the Next proxy and the energy service. Phase 6 build. */
  ENERGY_SHARED_SECRET: z.string().min(1).optional(),
});

const clientSchema = z.object({
  /** Canonical site URL for metadata, sitemap and robots. */
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  /** "true" enables the Energy Analyzer tab. Deferred in Phase 6 — default off. */
  NEXT_PUBLIC_ENERGY_ENABLED: z.enum(["true", "false"]).optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function formatIssues(prefix: string, error: z.ZodError): never {
  const details = error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  throw new Error(`${prefix}\n${details}`);
}

/**
 * Parse and return server-side environment. Call inside route handlers / server
 * code, not at module top-level, so a missing var fails the request rather than
 * the whole build.
 */
export function serverEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnv {
  const parsed = serverSchema.safeParse(source);
  if (!parsed.success) {
    formatIssues("Invalid server environment variables:", parsed.error);
  }
  return parsed.data;
}

/** Parse client-exposed environment. Safe to evaluate anywhere. */
export function parseClientEnv(source: Record<string, string | undefined>): ClientEnv {
  const parsed = clientSchema.safeParse(source);
  if (!parsed.success) {
    formatIssues("Invalid client environment variables:", parsed.error);
  }
  return parsed.data;
}

export const clientEnv: ClientEnv = parseClientEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ENERGY_ENABLED: process.env.NEXT_PUBLIC_ENERGY_ENABLED,
});
