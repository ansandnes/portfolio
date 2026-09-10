import { afterEach, describe, expect, it, vi } from "vitest";
import { __resetRateLimit, rateLimit } from "@/lib/rate-limit";

afterEach(() => {
  __resetRateLimit();
  vi.useRealTimers();
});

describe("rateLimit", () => {
  it("allows up to `limit` requests in a window, then blocks", () => {
    const opts = { limit: 3, windowMs: 1000 };
    expect(rateLimit("k", opts).ok).toBe(true);
    expect(rateLimit("k", opts).ok).toBe(true);
    expect(rateLimit("k", opts).ok).toBe(true);

    const blocked = rateLimit("k", opts);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("tracks keys independently", () => {
    const opts = { limit: 1, windowMs: 1000 };
    expect(rateLimit("a", opts).ok).toBe(true);
    expect(rateLimit("b", opts).ok).toBe(true);
    expect(rateLimit("a", opts).ok).toBe(false);
  });

  it("resets after the window elapses", () => {
    vi.useFakeTimers();
    const opts = { limit: 1, windowMs: 1000 };
    expect(rateLimit("k", opts).ok).toBe(true);
    expect(rateLimit("k", opts).ok).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rateLimit("k", opts).ok).toBe(true);
  });
});
