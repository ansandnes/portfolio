/**
 * Feature flags. Read from `NEXT_PUBLIC_*` env so they can be toggled per
 * deployment (Next inlines these at build time; in tests they come from
 * process.env at call time).
 */

/**
 * Energy Bill Analyzer. Deferred in Phase 6 (no real backend yet); the tab is
 * hidden and the API route 501s. Set NEXT_PUBLIC_ENERGY_ENABLED=true once the
 * Python service is built and deployed.
 */
export function isEnergyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENERGY_ENABLED === "true";
}
