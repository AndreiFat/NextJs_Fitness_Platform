import FavoriteButton from "@/components/ai-assistant/buttons/FavoriteButton";
import React from "react";
import CollapseComponentWorkouts from "@/components/ai-assistant/CollapseComponentWorkouts";

export const metadata = {
    title: "Favorite Exercises",
    description: "Page for Favorite Exercises",
};

export default async function FavoriteExercises({workouts}) {

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Favorite Exercises</h1>
            <p className="text-base-content/75 mb-6">Your saved workout routines, all in one place.</p>
            <div
                className={`grid grid-cols-1 ${workouts.length > 1 ? 'lg:grid-cols-2' : 'md:grid-cols-1'} gap-4 items-stretch`}>
                {workouts.map((workout, index) => {
                    const item = workout.item;
                    const itemHash = workout.item_hash;
                    return (
                        <div key={index}>
                            {item && (
                                <div className="card h-full flex flex-col">
                                    <div className="card-body bg-base-100/75 rounded-xl flex flex-col">
                                        <h2 className="card-title font-semibold flex justify-between">
                                            <div className="flex items-center gap-2">
                                                {item.day}
                                                <div className="badge badge-soft badge-success">{item.duration}</div>
                                                <div className="badge badge-soft badge-warning">{item.focus}</div>
                                            </div>
                                            <FavoriteButton
                                                type="workout"
                                                item={item}
                                                itemHash={itemHash}
                                                initiallySaved={true}
                                            />
                                        </h2>

                                        <div className="flex-grow">
                                            {item.exercises.map((exercise, idx) => (
                                                <div key={idx} className="mt-3">
                                                    <CollapseComponentWorkouts index={idx} workout={exercise}/>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="divider divider-success font-semibold">Warmup</div>
                                        <div className="card bg-base-100/75">
                                            <div className="card-body">{item.warmup}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
