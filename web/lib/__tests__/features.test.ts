import { afterEach, describe, expect, it } from "vitest";
import { isEnergyEnabled } from "@/lib/features";

const original = process.env.NEXT_PUBLIC_ENERGY_ENABLED;
afterEach(() => {
  process.env.NEXT_PUBLIC_ENERGY_ENABLED = original;
});

describe("isEnergyEnabled", () => {
  it("is false by default", () => {
    delete process.env.NEXT_PUBLIC_ENERGY_ENABLED;
    expect(isEnergyEnabled()).toBe(false);
  });

  it('is false for anything other than "true"', () => {
    process.env.NEXT_PUBLIC_ENERGY_ENABLED = "false";
    expect(isEnergyEnabled()).toBe(false);
    process.env.NEXT_PUBLIC_ENERGY_ENABLED = "1";
    expect(isEnergyEnabled()).toBe(false);
  });

  it('is true only for exactly "true"', () => {
    process.env.NEXT_PUBLIC_ENERGY_ENABLED = "true";
    expect(isEnergyEnabled()).toBe(true);
  });
});
