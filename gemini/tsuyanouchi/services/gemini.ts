import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing. Please set process.env.API_KEY.");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (name: string, category: string, keywords: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `
            You are a senior copywriter for "Tsuyanouchi", an ultra-luxury Japanese-inspired lifestyle brand.
            Write a compelling, sophisticated, and concise product description (max 40 words) for a product.
            
            Product Name: ${name}
            Category: ${category}
            Keywords/Vibe: ${keywords}
            
            Tone: Minimalist, poetic, exclusive, high-end.
            Do not include the product name in the description if possible, focus on the feeling and quality.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Could not generate description.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error generating description. Please check your API key.";
    }
};
