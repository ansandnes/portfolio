import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import { serverEnv } from "@/lib/env";
import { recipeResponseSchema, type RecipeResponse } from "@/lib/schemas";

const MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

/** Lazily create a single shared client. Throws if the key is not configured. */
function getClient(): GoogleGenAI {
  if (client) return client;
  const { API_KEY_GEMINI } = serverEnv();
  if (!API_KEY_GEMINI) {
    throw new Error("API_KEY_GEMINI is not configured");
  }
  client = new GoogleGenAI({ apiKey: API_KEY_GEMINI });
  return client;
}

/** Free-form text generation. */
export async function generateText(prompt: string): Promise<string> {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return response.text ?? "";
}

/** Structured recipe generation, validated against `recipeResponseSchema`. */
export async function generateRecipe(prompt: string): Promise<RecipeResponse> {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents:
      `Suggest a recipe based on this request: "${prompt}". ` +
      `Return the recipe name, a list of ingredients (with quantities), and brief instructions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipeName: { type: Type.STRING, description: "The name of the recommended dish" },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of ingredients with rough quantities",
          },
          instructions: { type: Type.STRING, description: "Brief cooking instructions" },
        },
        required: ["recipeName", "ingredients", "instructions"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Empty response from model");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(response.text);
  } catch {
    throw new Error("Model response was not valid JSON");
  }

  const parsed = recipeResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Model response did not match the expected schema");
  }
  return parsed.data;
}
