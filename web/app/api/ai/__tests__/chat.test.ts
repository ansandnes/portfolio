import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/lib/gemini", () => ({ generateText: vi.fn() }));
vi.mock("@/lib/log", () => ({
  log: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

import { POST } from "@/app/api/ai/chat/route";
import { generateText } from "@/lib/gemini";
import { __resetRateLimit } from "@/lib/rate-limit";

const mockGenerate = vi.mocked(generateText);
const SAME_ORIGIN = { origin: "http://localhost:3000", host: "localhost:3000" };

function makeReq(body: unknown, headers: Record<string, string> = SAME_ORIGIN): NextRequest {
  return new Request("http://localhost:3000/api/ai/chat", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }) as unknown as NextRequest;
}

beforeEach(() => {
  __resetRateLimit();
  mockGenerate.mockReset();
});
afterEach(() => vi.clearAllMocks());

describe("POST /api/ai/chat", () => {
  it("returns the generated text on a valid request", async () => {
    mockGenerate.mockResolvedValue("Hello there.");
    const res = await POST(makeReq({ prompt: "hi" }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ data: "Hello there." });
  });

  it("returns 502 when the model call fails", async () => {
    mockGenerate.mockRejectedValue(new Error("boom"));
    const res = await POST(makeReq({ prompt: "hi" }));
    expect(res.status).toBe(502);
  });

  it("rejects a cross-site origin with 403", async () => {
    const res = await POST(makeReq({ prompt: "hi" }, { origin: "https://evil.test", host: "localhost:3000" }));
    expect(res.status).toBe(403);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("rejects an over-long prompt with 400", async () => {
    const res = await POST(makeReq({ prompt: "x".repeat(2001) }));
    expect(res.status).toBe(400);
  });
});
