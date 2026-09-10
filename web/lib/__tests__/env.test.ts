import { describe, expect, it } from "vitest";
import { parseClientEnv, serverEnv } from "@/lib/env";

describe("serverEnv", () => {
  it("accepts a present API key", () => {
    expect(serverEnv({ API_KEY_GEMINI: "test-key" })).toEqual({
      API_KEY_GEMINI: "test-key",
    });
  });

  it("accepts a missing API key", () => {
    expect(serverEnv({})).toEqual({});
  });

  it("rejects an empty API key", () => {
    expect(() => serverEnv({ API_KEY_GEMINI: "" })).toThrow(/Invalid server environment/);
  });

  it("accepts the reserved energy-service vars", () => {
    expect(
      serverEnv({ ENERGY_SERVICE_URL: "https://energy.example.com", ENERGY_SHARED_SECRET: "s3cr3t" }),
    ).toEqual({
      ENERGY_SERVICE_URL: "https://energy.example.com",
      ENERGY_SHARED_SECRET: "s3cr3t",
    });
  });
});

describe("parseClientEnv", () => {
  it("accepts a valid site URL and energy flag", () => {
    expect(
      parseClientEnv({
        NEXT_PUBLIC_SITE_URL: "https://example.com",
        NEXT_PUBLIC_ENERGY_ENABLED: "true",
      }),
    ).toEqual({
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      NEXT_PUBLIC_ENERGY_ENABLED: "true",
    });
  });

  it("accepts an empty object", () => {
    expect(parseClientEnv({})).toEqual({});
  });

  it("rejects a non-URL site URL", () => {
    expect(() => parseClientEnv({ NEXT_PUBLIC_SITE_URL: "not-a-url" })).toThrow(
      /Invalid client environment/,
    );
  });

  it("rejects an unknown energy-flag value", () => {
    expect(() => parseClientEnv({ NEXT_PUBLIC_ENERGY_ENABLED: "yes" })).toThrow(
      /Invalid client environment/,
    );
  });
});
