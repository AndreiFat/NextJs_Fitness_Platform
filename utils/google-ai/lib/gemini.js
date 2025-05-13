import {GoogleGenAI} from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function askGemini(prompt) {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    return response.text;
}
