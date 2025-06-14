'use server'

import {askGeminiEverything, askGeminiRecipes, askGeminiWorkouts} from "@/utils/google-ai/lib/gemini";
import {searchYouTubeVideos} from "@/utils/google-ai/lib/youtube-api";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import crypto from 'crypto';
import {revalidatePath} from "next/cache";

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
        prompt.includes("exerciții") ||
        prompt.includes("antrenament") ||
        prompt.includes("antrenamente") ||
        prompt.includes("sedință de antrenament") ||
        prompt.includes("ședință de antrenament") ||
        prompt.includes("program de antrenament") ||
        prompt.includes("rutina de antrenament") ||
        prompt.includes("exerciții fizice") ||
        prompt.includes("fitness") ||
        prompt.includes("sesiune de exerciții") ||
        prompt.includes("sesiune de antrenament") ||
        prompt.includes("mișcare") ||
        prompt.includes("exercițiu fizic") ||
        prompt.includes("exerciții sportive") ||
        prompt.includes("antrenor") ||
        prompt.includes("pregătire fizică") ||
        prompt.includes("încălzire") ||
        prompt.includes("stretching")
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
        prompt.includes("masa") ||
        prompt.includes("masă") ||
        prompt.includes("mese") ||
        prompt.includes("plan de masă") ||
        prompt.includes("plan alimentar") ||
        prompt.includes("plan de alimentație") ||
        prompt.includes("plan alimentar zilnic") ||
        prompt.includes("dietă") ||
        prompt.includes("diete") ||
        prompt.includes("regim alimentar") ||
        prompt.includes("alimentatie") ||
        prompt.includes("nutriție") ||
        prompt.includes("nutriție personalizată") ||
        prompt.includes("alimente") ||
        prompt.includes("alimente sănătoase") ||
        prompt.includes("plan nutrițional") ||
        prompt.includes("plan de nutriție")
    ) {
        const aiText = await askGeminiRecipes(prompt, goal, calories);

        let jsonResponse = null;
        const MAX_LENGTH = 30000;
        try {
            if (!aiText || aiText.length > MAX_LENGTH) {
                return {
                    type: "meal",
                    error: "Sorry, the AI response is too long. Please try again with a shorter prompt."
                }
            }

            jsonResponse = JSON.parse(aiText);
        } catch (err) {
            return {
                type: "meal",
                error: "AI response is not in JSON format.",
            };
        }
        result = {
            type: "meal",
            response: jsonResponse.recipes_plan
        };
    } else {
        const aiText = await askGeminiEverything(prompt, goal, calories);
        result = {
            type: "everything",
            response: aiText
        };
    }

    console.log(result);
    return result;
}

// Hashing function to match items (optional, for uniqueness)
function hashItem(item) {
    return crypto.createHash('sha256').update(JSON.stringify(item)).digest('hex');
}

export async function toggleFavoriteAIItem({type, item, itemHash}) {
    const supabase = await createSupabaseServerClient();
    const {
        data: {user}
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Check if this item is already saved
    const {data: existing, error: findError} = await supabase
        .from('ai_favorite_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_hash', itemHash)
        .maybeSingle();

    if (findError) throw findError;

    if (existing) {
        const {error: deleteError} = await supabase
            .from('ai_favorite_items')
            .delete()
            .eq('id', existing.id);
        if (deleteError) throw deleteError;
        revalidatePath('/admin/favorites', 'layout')
        return {saved: false};
    } else {
        const {error: insertError} = await supabase
            .from('ai_favorite_items')
            .insert({
                user_id: user.id,
                type,
                item,
                item_hash: itemHash
            });
        if (insertError) throw insertError;
        revalidatePath('/admin/favorites', 'layout')
        return {saved: true};
    }

}