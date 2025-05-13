'use server'

import {askGeminiEverything, askGeminiRecipes, askGeminiWorkouts} from "@/utils/google-ai/lib/gemini";
import {searchYouTubeVideos} from "@/utils/google-ai/lib/youtube-api";

export async function handleAIGeneration(formData) {
    const prompt = formData.get('prompt')?.toLowerCase();
    const goal = formData.get('goal');
    const calories = formData.get('calories');

    if (!prompt) return;

    console.log("Prompt:", prompt);
    console.log("Goal:", goal);
    console.log("Calories:", calories);

    let result = {};

    if (
        prompt.includes("workout") ||
        prompt.includes("exercițiu") ||
        prompt.includes("antrenament")
    ) {
        const aiText = await askGeminiWorkouts(`User goal: ${goal}, calories: ${calories}. Generate a workout plan for: ${prompt}`);
        const videos = await searchYouTubeVideos(prompt);

        result = {
            type: "workout",
            ai: aiText,
            youtube: videos,
        };
    } else if (
        prompt.includes("meniu") ||
        prompt.includes("menu") ||
        prompt.includes("meal") ||
        prompt.includes("meal plan") ||
        prompt.includes("diet")
    ) {
        const aiText = await askGeminiRecipes(`User goal: ${goal}, calories: ${calories}. Generate a meal plan for: ${prompt}`);

        result = {
            type: "meal",
            ai: aiText
        };
    } else {
        const aiText = await askGeminiEverything(prompt);
        result = {
            type: "everything",
            ai: aiText
        };
    }

    console.log("AI RESULT:", result);
}