import type { NextApiRequest, NextApiResponse } from "next";
import { generateText, generateRecipeAndIngredients } from "@/app/services/ai/gemini/generateText";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt, type } = req.body;

    console.log("API hit:", prompt);
    console.log("API Key Loaded:", process.env.API_KEY_GEMINI ? "YES" : "NO");

    try {
        let result;

        if (type === "recipe") {
            result = await generateRecipeAndIngredients(prompt);
        } else {
            result = await generateText(prompt);
        }

        return res.status(200).json({ data: result });

    } catch (err) {
        console.error("Gemini error:", err);
        return res.status(500).json({ error: "Failed to generate AI output" });
    }
}
