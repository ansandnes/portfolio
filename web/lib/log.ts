/**
 * Minimal level-gated logger. Replaces ad-hoc `console.log` in route handlers.
 * Set LOG_LEVEL to debug | info | warn | error (default: info).
 */
type Level = "debug" | "info" | "warn" | "error";

const ORDER: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

const configured = (process.env.LOG_LEVEL as Level | undefined) ?? "info";
const threshold = ORDER[configured] ?? ORDER.info;

function emit(level: Level, message: string, meta?: unknown): void {
  if (ORDER[level] < threshold) return;
  const args: unknown[] = [`[${level}] ${message}`];
  if (meta !== undefined) args.push(meta);
  if (level === "error") console.error(...args);
  else if (level === "warn") console.warn(...args);
  else console.log(...args);
}

export const log = {
  debug: (message: string, meta?: unknown) => emit("debug", message, meta),
  info: (message: string, meta?: unknown) => emit("info", message, meta),
  warn: (message: string, meta?: unknown) => emit("warn", message, meta),
  error: (message: string, meta?: unknown) => emit("error", message, meta),
};
