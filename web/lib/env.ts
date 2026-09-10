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
});

const clientSchema = z.object({
  /**
   * Base URL of the Python energy-analysis service. Optional until the Energy
   * Analyzer feature is enabled (Phase 6).
   */
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
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
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
