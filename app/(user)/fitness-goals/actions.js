'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {askGemini} from "@/utils/google-ai/lib/gemini";

export default async function saveFitnessLog(formData) {
    const supabase = await createSupabaseServerClient();

    const height = formData.get('height');
    const weight = formData.get('weight');
    const abdominal_circumference = formData.get('abdominal_circumference');
    const hip_circumference = formData.get('hip_circumference');
    const IMC = weight / (height * height) * 10000;

    console.log(hip_circumference, abdominal_circumference, weight, IMC, height);

    const {data, error} = await supabase
        .from('metabolic_progress_logs')
        .insert([
            {
                weight: weight,
                abdominal_circumference: abdominal_circumference,
                hip_circumference: hip_circumference,
                IMC: IMC
            }
        ])
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}

export async function generateMealPlan(goalType, calories) {
    //const prompt = `Generate a meal plan for someone who wants ${goalType}. Caloric goal: ${calories} kcal/day. Include 3 meals and 2 snacks.`;
    const prompt = `
List 5 existing YouTube workout videos for people who want to lose weight. 
Only include real, full YouTube links (https://www.youtube.com/watch?v=...) and include the video title.
Avoid making up URLs. 
Format the result like:

1. [Title] - https://www.youtube.com/watch?v=...
2. ...
`;
    const result = await askGemini(prompt);
    console.log(result);
    //return result;
}

// export async function generateWorkoutPlan() {
//     const apiKey = process.env.YOUTUBE_API_KEY;
//     const query = "Give me a fitness workout plan for losing weight for 7 days."
//     const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video`;
//
//     const res = await fetch(url);
//     const data = await res.json();
//
//     if (!data.items) return [];
//
//     const results = data.items.map((item) => ({
//         title: item.snippet.title,
//         videoId: item.id.videoId,
//         url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
//         thumbnail: item.snippet.thumbnails.high.url,
//         channel: item.snippet.channelTitle,
//         description: item.snippet.description,
//     }));
//
//     console.log(results);
// }

export async function generateWorkoutPlan(goalType) {
    const apiKey = process.env.YOUTUBE_API_KEY;

    // 1. Generarea planului de antrenament cu Gemini
    const prompt = `Create a 7-day fitness workout plan for someone who wants to lose weight. Include exercises for each day with a YouTube search keyword for each day. 
    Format: 
    Day 1: HIIT - search: "15 min full body HIIT no equipment"
    Day 2: Yoga - search: "morning yoga for weight loss"
    ... and so on.`;

    const plan = await askGemini(prompt);  // Planul generat de Gemini

    console.log("AI-generated workout plan:", plan);

    // 2. Extrage cuvintele cheie din planul generat de Gemini
    const days = plan.split("\n").map(line => {
        const match = line.match(/search:\s*["']?(.+?)["']?$/i);
        return match ? match[1] : null;  // Extrage keyword-ul de căutare
    }).filter(Boolean);

    // 3. Căutarea videoclipurilor YouTube pentru fiecare cuvânt-cheie
    const allVideos = [];
    for (const keyword of days) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&key=${apiKey}&type=video`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items) {
            const videos = data.items.map(item => ({
                title: item.snippet.title,
                videoId: item.id.videoId,
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                thumbnail: item.snippet.thumbnails.high.url,
                channel: item.snippet.channelTitle,
                description: item.snippet.description
            }));
            allVideos.push({keyword, videos});
        }
    }

    // 4. Returnează rezultatul final cu planul și videoclipurile
    return {
        plan: plan,  // Planul generat de Gemini
        videos: allVideos  // Videoclipurile relevante de pe YouTube
    };
}
