import { describe, expect, it } from "vitest";
import { parseClientEnv, serverEnv } from "@/lib/env";

describe("serverEnv", () => {
  it("accepts a present API key", () => {
    expect(serverEnv({ API_KEY_GEMINI: "test-key" })).toEqual({
      API_KEY_GEMINI: "test-key",
    });
  });

  it("accepts a missing API key (optional until Phase 2 wiring)", () => {
    expect(serverEnv({})).toEqual({});
  });

  it("rejects an empty API key", () => {
    expect(() => serverEnv({ API_KEY_GEMINI: "" })).toThrow(/Invalid server environment/);
  });
});

describe("parseClientEnv", () => {
  it("accepts valid URLs", () => {
    expect(
      parseClientEnv({
        NEXT_PUBLIC_API_URL: "http://localhost:8000",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
      }),
    ).toEqual({
      NEXT_PUBLIC_API_URL: "http://localhost:8000",
      NEXT_PUBLIC_SITE_URL: "https://example.com",
    });
  });

  it("accepts an absent URL", () => {
    expect(parseClientEnv({})).toEqual({});
  });

  it("rejects a non-URL string", () => {
    expect(() => parseClientEnv({ NEXT_PUBLIC_API_URL: "not-a-url" })).toThrow(
      /Invalid client environment/,
    );
  });
});
