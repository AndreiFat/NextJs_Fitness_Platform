'use client';

import {useSearchParams} from 'next/navigation';
import React, {useActionState} from 'react';
import {handleAIGeneration} from '@/app/(user)/ai-assistant/actions';
import SkeletonOnLoad from "@/components/ai-assistant/SkeletonOnLoad";
import AiGeneratedMeal from "@/components/ai-assistant/AiGeneratedMeal";
import AiGeneratedWorkout from "@/components/ai-assistant/AiGeneratedWorkout";


const initialState = null;

export default function AiGeneration() {
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
            className={`ai-plan bg-linear-to-r from-cyan-400/10 to-teal-500/2 pt-[100px] transition-all duration-500 ease-in-out min-h-screen ${response ? 'h-auto' : 'h-dvh'}`}>
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

                    <form action={formAction} className="space-y-8">
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
                            </div>
                        </>
                    ) : (<>
                        {response && (
                            <div className="mt-6 text-left">
                                {response.type === 'meal' ? (
                                    <>{response.error ?
                                        <div role="alert" className="alert alert-error my-4">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-6 w-6 shrink-0 stroke-current" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span>{response.error}</span>
                                        </div> : null}
                                        <AiGeneratedMeal response={response.response}></AiGeneratedMeal>
                                    </>
                                ) : (response.type === 'workout' ? (
                                    <>
                                        <div
                                            className="flex overflow-x-auto space-x-4 p-4 bg-base-100/75 rounded-xl my-3">
                                            {response.youtube.map((video, index) => (
                                                <div key={index}>
                                                    <iframe
                                                        className="sm:min-w-[450px] sm:h-[250px] md:min-w-[650px] md:h-[350px] rounded-lg shadow"
                                                        src={`https://www.youtube.com/embed/${video.videoId}`}
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ))}
                                        </div>
                                        <AiGeneratedWorkout response={response.response}></AiGeneratedWorkout></>
                                ) : (
                                    <div className="flex justify-center">
                                        <div className="card bg-base-100/50 max-w-6xl">
                                            <div className="card-body">
                                                <h2 className={"text-2xl font-semibold"}>Sigur!</h2>
                                                <p className={"text-base-content/75 text-[15px]"}>{response.response}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}</>)}
                </div>
            </div>
        </div>
    );
}