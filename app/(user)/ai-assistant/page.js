'use client';

import {useSearchParams} from 'next/navigation';
import {useActionState} from 'react';
import {handleAIGeneration} from '@/app/(user)/ai-assistant/actions';
import SkeletonOnLoad from "@/components/ai-assistant/SkeletonOnLoad";
import AiGeneratedMeal from "@/components/ai-assistant/AiGeneratedMeal";


const initialState = null;

export default function AiGeneratedPlan() {
    const searchParams = useSearchParams();
    const goal = searchParams.get('goal');
    const calories = searchParams.get('calories');

    const [response, formAction, isPending] = useActionState(
        async (prevState, formData) => {
            formData.set('goal', goal);
            formData.set('calories', calories);
            return await handleAIGeneration(formData);
        },
        initialState
    );

    return (
        <div
            className={`ai-plan bg-linear-to-r from-cyan-400/8 to-teal-500/8 p-[100px] transition-all duration-500 ease-in-out ${response ? 'h-auto' : 'h-dvh'}`}>
            <div className="container mx-auto">
                <div className="p-12 space-y-4 text-center">
                    <span
                        className="p-4 mb-4 font-medium border-0 bg-cyan-500 shadow-lg shadow-cyan-500/30  text-white
                          badge bg-linear-to-r/decreasing from-indigo-500 to-teal-400">
                        Smart Fitness & Nutrition Assistant</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Discover smart recipes and workouts designed by AI to help you feel your best
                    </h2>
                    <p className="px-10">
                        Personalized meals and workouts, tailored to your lifestyle and goals.
                    </p>

                    <form action={formAction} className="space-y-4">
                        <label className="input border-0 w-full md:w-2xl input-xl text-base opacity-55 text-white">
                            <input className="p-3" type="search" name="prompt" required
                                   placeholder="e.g. Create a weekly meal plan for muscle gain with 2500 calories"/>
                        </label>
                        <div>
                            <button type="submit"
                                    className="btn p-6 w-[130px] bg-linear-to-r to-cyan-500 from-blue-500 text-white">
                                {isPending ? <span className="loading loading-dots loading-md"></span> : 'Generate'}
                            </button>
                        </div>
                    </form>
                    {isPending ? (<>
                            <div className="flex gap-6">
                                <SkeletonOnLoad></SkeletonOnLoad>
                                <SkeletonOnLoad></SkeletonOnLoad>
                                <SkeletonOnLoad></SkeletonOnLoad>
                            </div>
                        </>
                    ) : (<>
                        {response && (
                            <div className="mt-6 text-left">
                                <h3 className="text-xl font-semibold">AI Response:</h3>
                                {response.type === 'meal' ? (
                                    <AiGeneratedMeal response={response.response}></AiGeneratedMeal>
                                ) : (response.type === 'workout' ? (
                                    'altceva'
                                ) : ('ceva jmecher cu dublu jm'))}

                            </div>
                        )}</>)}
                </div>
            </div>
        </div>
    );
}