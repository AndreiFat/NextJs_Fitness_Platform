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
        const aiText = await askGeminiWorkouts(prompt, goal, calories);
        const videos = await searchYouTubeVideos(prompt);

        let jsonResponse = null;
        try {
            jsonResponse = JSON.parse(aiText);
        } catch (err) {
            console.error("Failed to parse Gemini response:", err);
            jsonResponse = {error: "Invalid JSON from AI", raw: aiText};
        }
        result = {
            type: "workout",
            response: jsonResponse.workout_plan,
            youtube: videos,
        };
    } else if (
        prompt.includes("meniu") ||
        prompt.includes("menu") ||
        prompt.includes("meal") ||
        prompt.includes("meal plan") ||
        prompt.includes("diet")
    ) {
        const aiText = await askGeminiRecipes(prompt, goal, calories);

        let jsonResponse = null;
        try {
            jsonResponse = JSON.parse(aiText);
        } catch (err) {
            console.error("Failed to parse Gemini response:", err);
            jsonResponse = {error: "Invalid JSON from AI", raw: aiText};
        }
        // TODO: validare pentru raspuns prea lung - in cazul in care se genereaza o eroare transmitem utilizatorului un mesaj

        result = {
            type: "meal",
            response: jsonResponse.recipes_plan
        };
        console.log(result);
    } else {
        const aiText = await askGeminiEverything(prompt);
        result = {
            type: "everything",
            response: aiText
        };
    }

    return result;
}