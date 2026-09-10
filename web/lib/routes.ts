/**
 * Canonical route paths. Replaces the former `AppRoute` enum (which also held a
 * non-route `ENERGY` value). Import these instead of hard-coding path strings.
 */
export const ROUTES = {
  home: "/",
  resume: "/resume",
  experience: "/experience",
  testimonials: "/testimonials",
  projects: "/projects",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** Ordered navigation entries (labels/icons are attached in the Navbar). */
export const NAV_ITEMS: ReadonlyArray<{ href: RoutePath; label: string }> = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.resume, label: "CV - Resume" },
  { href: ROUTES.experience, label: "Experience" },
  { href: ROUTES.testimonials, label: "Testimonials" },
  { href: ROUTES.projects, label: "Projects" },
];
