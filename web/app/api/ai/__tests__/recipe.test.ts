import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/lib/gemini", () => ({ generateRecipe: vi.fn() }));
vi.mock("@/lib/log", () => ({
  log: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

import { POST } from "@/app/api/ai/recipe/route";
import { generateRecipe } from "@/lib/gemini";
import { __resetRateLimit } from "@/lib/rate-limit";

const mockGenerate = vi.mocked(generateRecipe);
const SAME_ORIGIN = { origin: "http://localhost:3000", host: "localhost:3000" };
const RECIPE = { recipeName: "Pasta", ingredients: ["pasta"], instructions: "Boil." };

function makeReq(body: unknown, headers: Record<string, string> = SAME_ORIGIN): NextRequest {
  return new Request("http://localhost:3000/api/ai/recipe", {
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

describe("POST /api/ai/recipe", () => {
  it("returns the generated recipe on a valid same-origin request", async () => {
    mockGenerate.mockResolvedValue(RECIPE);
    const res = await POST(makeReq({ prompt: "quick pasta" }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ data: RECIPE });
  });

  it("returns 502 with an opaque error when the model call fails", async () => {
    mockGenerate.mockRejectedValue(new Error("schema mismatch"));
    const res = await POST(makeReq({ prompt: "quick pasta" }));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toBeTruthy();
    expect(JSON.stringify(body)).not.toContain("schema mismatch");
  });

  it("rejects a cross-site origin with 403", async () => {
    const res = await POST(
      makeReq({ prompt: "x" }, { origin: "https://evil.test", host: "localhost:3000" }),
    );
    expect(res.status).toBe(403);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("rejects an invalid body with 400", async () => {
    const res = await POST(makeReq({ nope: 1 }));
    expect(res.status).toBe(400);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("rate-limits after 10 requests per minute", async () => {
    mockGenerate.mockResolvedValue(RECIPE);
    const codes: number[] = [];
    for (let i = 0; i < 12; i++) {
      codes.push((await POST(makeReq({ prompt: "x" }))).status);
    }
    expect(codes.filter((c) => c === 200)).toHaveLength(10);
    expect(codes.filter((c) => c === 429)).toHaveLength(2);
  });
});
