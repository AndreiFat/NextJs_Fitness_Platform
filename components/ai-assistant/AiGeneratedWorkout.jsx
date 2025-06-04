'use client';

import React, {useEffect, useState} from 'react';
import CollapseComponentWorkouts from "@/components/ai-assistant/CollapseComponentWorkouts";
import FavoriteButton from "@/components/ai-assistant/buttons/FavoriteButton";
import crypto from 'crypto';
import {createSupabaseClient} from "@/utils/supabase/client"; // Only works in Node / Next.js runtime

function hashItem(item) {
    return crypto.createHash('sha256').update(JSON.stringify(item)).digest('hex');
}

function AiGeneratedWorkout({response}) {
    const [favoriteHashes, setFavoriteHashes] = useState(new Set());

    useEffect(() => {
        const supabase = createSupabaseClient();

        const fetchFavoriteHashes = async () => {
            const {data, error} = await supabase
                .from('ai_favorite_items')
                .select('item_hash')
                .eq('type', 'workout');

            if (error) {
                console.error("Failed to load favorites:", error);
                return;
            }

            const hashes = new Set(data.map(item => item.item_hash));
            setFavoriteHashes(hashes);
        };

        fetchFavoriteHashes();
    }, []);

    return (
        <div
            className={`grid grid-cols-1 ${response.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4 items-stretch`}>
            {response.map((workout, index) => {
                const item = workout.days;
                const itemHash = hashItem(item);
                const isFavorite = favoriteHashes.has(itemHash);

                return (
                    <div key={index} className="h-full">
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
                                            initiallySaved={isFavorite}
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
    );
}

export default AiGeneratedWorkout;