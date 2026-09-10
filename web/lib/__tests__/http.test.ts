import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";
import { clientKey, isSameOrigin } from "@/lib/http";

function req(headers: Record<string, string>): NextRequest {
  return { headers: new Headers(headers) } as unknown as NextRequest;
}

describe("isSameOrigin", () => {
  it("allows when Origin host matches the request host", () => {
    expect(isSameOrigin(req({ host: "example.com", origin: "https://example.com" }))).toBe(true);
  });

  it("rejects a cross-site Origin", () => {
    expect(isSameOrigin(req({ host: "example.com", origin: "https://evil.test" }))).toBe(false);
  });

  it("falls back to Referer when Origin is absent", () => {
    expect(isSameOrigin(req({ host: "example.com", referer: "https://example.com/projects" }))).toBe(
      true,
    );
    expect(isSameOrigin(req({ host: "example.com", referer: "https://evil.test/x" }))).toBe(false);
  });

  it("rejects when neither Origin nor Referer is present", () => {
    expect(isSameOrigin(req({ host: "example.com" }))).toBe(false);
  });
});

describe("clientKey", () => {
  it("uses the first x-forwarded-for entry", () => {
    expect(clientKey(req({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip then 'unknown'", () => {
    expect(clientKey(req({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientKey(req({}))).toBe("unknown");
  });
});
