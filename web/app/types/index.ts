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
