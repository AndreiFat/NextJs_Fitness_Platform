'use client'

import FavoriteRecipes from "@/app/(user)/favorites/recipes/FavoriteRecipes";
import FavoriteExercises from "@/app/(user)/favorites/exercises/FavoriteExercises";
import {useSearchParams} from "next/navigation";
import {handleAIGeneration} from "@/app/(user)/ai-assistant/actions";

export default function AiGeneratedPlan() {
    const searchParams = useSearchParams();
    const goal = searchParams.get('goal');
    const calories = searchParams.get('calories');

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">
                It's really nice that you've got here. What do you want? A weekly meal prep or a workout plan?
            </h2>

            <form action={handleAIGeneration} className="space-y-4">
                <input type="hidden" name="goal" value={goal}/>
                <input type="hidden" name="calories" value={calories}/>

                <textarea
                    name="prompt"
                    className="textarea textarea-bordered w-full"
                    placeholder="Tell us what you want (e.g. 'Give me a 7-day meal plan for weight loss')"
                    required
                />
                <button type="submit" className="btn btn-primary">
                    Generate
                </button>
            </form>

            <div className="tabs tabs-lift px-4">
                <label className="tab">
                    <input type="radio" name="my_tabs_4"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                              d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Z"/>
                    </svg>
                    Menus
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    <FavoriteRecipes/>
                </div>

                <label className="tab">
                    <input type="radio" name="my_tabs_4"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                    </svg>
                    Exercises
                </label>
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    <FavoriteExercises/>
                </div>
            </div>
        </div>
    );
}