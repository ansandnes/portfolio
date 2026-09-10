import { GoogleGenAI, Type } from "@google/genai";

export async function generateText(prompt: string) {
    if (!process.env.API_KEY_GEMINI) {
        console.error("Missing API key");
        throw new Error("No API key");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text || "No response";
}

// 
export async function generateRecipeAndIngredients(prompt: string) {

    if (!process.env.API_KEY_GEMINI) {
        console.error("Missing API key");
        throw new Error("No API key");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI });

    if (!ai) {
        console.error("AI not initialized");
        throw new Error("AI not initialized");
    }

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Suggest a recipe based on this request: "${prompt}". Return the recipe name, a list of ingredients (with quantities), and brief instructions.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recipeName: {
                            type: Type.STRING,
                            description: 'The name of the recommended dish',
                        },
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                            description: 'List of ingredients with rough quantities',
                        },
                        instructions: {
                            type: Type.STRING,
                            description: 'Brief cooking instructions',
                        }
                    },
                    required: ["recipeName", "ingredients", "instructions"],
                },
            },
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("No response text from AI");
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
