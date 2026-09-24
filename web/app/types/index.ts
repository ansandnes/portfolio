// Route paths now live in `@/lib/routes` (ROUTES). The former `AppRoute` enum
// (which also held a non-route `ENERGY` value) has been removed.

export type { RecipeResponse } from "@/lib/schemas";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  techStack: string[];
  /** Path under /public to a photo shown as a circular thumbnail on the card. */
  image?: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  description?: string;
}

/** A chunk of prose, or a link rendered inline within it. */
export type TextSegment = string | { text: string; href: string };

/** The parts of a featured project that read as prose — translated per locale. */
export interface FeaturedProjectTranslation {
  tagline: string;
  goal: string;
  motivation: TextSegment[];
  architecture: ArchitectureNode[];
}

export interface FeaturedProject {
  id: string;
  name: string;
  url: string;
  techStack: string[];
  translations: { en: FeaturedProjectTranslation; no: FeaturedProjectTranslation };
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  relation: string;
  image: string | null;
  content: string;
  tech: string[];
  traits: string[];
  impact: string[];
}

export enum MiniAppType {
  TODO = "todo",
  RECIPE = "recipe",
  SNAKE = "snake",
  ENERGY = "energy",
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
