import { z } from "zod";

/** Structured recipe returned by the AI recipe endpoint. */
export const recipeResponseSchema = z.object({
  recipeName: z.string().min(1),
  ingredients: z.array(z.string().min(1)).min(1),
  instructions: z.string().min(1),
});
export type RecipeResponse = z.infer<typeof recipeResponseSchema>;

/** POST body for `/api/ai/recipe`. */
export const recipeRequestSchema = z.object({
  prompt: z.string().trim().min(1).max(500),
});

/** POST body for `/api/ai/chat`. */
export const chatRequestSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
});
