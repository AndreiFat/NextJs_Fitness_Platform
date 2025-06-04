'use client';

import React, {useEffect, useState} from 'react';
import CollapseComponentMeals from "@/components/ai-assistant/CollapseComponentMeals";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCookieBite, faXmark} from "@fortawesome/free-solid-svg-icons";
import FavoriteButton from "@/components/ai-assistant/buttons/FavoriteButton";
import crypto from 'crypto';
import {createSupabaseClient} from "@/utils/supabase/client"; // This works in Next.js (not plain browser apps)

function hashItem(item) {
    return crypto.createHash('sha256').update(JSON.stringify(item)).digest('hex');
}

function AiGeneratedMeal({response}) {
    const [showToast, setShowToast] = useState(true);
    const [hideAnimation, setHideAnimation] = useState(false);
    const [favoriteHashes, setFavoriteHashes] = useState(new Set());

    // Fetch favorite hashes from Supabase on mount
    useEffect(() => {
        const supabase = createSupabaseClient();

        const fetchFavoriteHashes = async () => {
            const {data, error} = await supabase
                .from('ai_favorite_items')
                .select('item_hash')
                .eq('type', 'meal');

            if (error) {
                console.error("Error fetching favorites:", error);
            } else {
                const hashes = new Set(data.map(fav => fav.item_hash));
                setFavoriteHashes(hashes);
            }
        };

        fetchFavoriteHashes();
    }, []);

    // Auto-close toast
    useEffect(() => {
        const timer = setTimeout(() => {
            setHideAnimation(true);
            setTimeout(() => setShowToast(false), 300);
        }, 60000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setHideAnimation(true);
        setTimeout(() => setShowToast(false), 300);
    };

    return (
        <div>
            {response.map((recipes, index) => (
                <div
                    key={index}
                    className={`grid grid-cols-1 ${recipes.days.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}
                >
                    {recipes.days.map((recipe, index) => {
                        const itemHash = hashItem(recipe);
                        const isFavorite = favoriteHashes.has(itemHash);

                        return (
                            <div key={index} className="card mt-3">
                                <div className="card-body bg-base-100/75 rounded-xl">
                                    <h2 className="card-title font-semibold flex justify-between">
                                        {recipe.day}
                                        <FavoriteButton
                                            type="meal"
                                            item={recipe}
                                            itemHash={itemHash}
                                            initiallySaved={isFavorite}
                                        />
                                    </h2>

                                    <CollapseComponentMeals
                                        index={index}
                                        recipe={recipe.breakfast}
                                        mealType="Breakfast"
                                        badgeColor="primary"
                                    />
                                    <CollapseComponentMeals
                                        index={index}
                                        recipe={recipe.lunch}
                                        mealType="Lunch"
                                        badgeColor="secondary"
                                    />
                                    <CollapseComponentMeals
                                        index={index}
                                        recipe={recipe.dinner}
                                        mealType="Dinner"
                                        badgeColor="accent"
                                    />
                                    <div className="divider divider-primary">Snacks</div>
                                    <div className="card card-sm bg-base-200/75 rounded-xl">
                                        <div className="card-body">
                                            {recipe.snacks.map((snack, i) => (
                                                <p key={i}>
                                                    <FontAwesomeIcon icon={faCookieBite} size="lg" className="me-3"/>
                                                    {snack}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {showToast && recipes.notes && (
                        <div
                            className={`toast transition-all duration-300 ease-in-out ${
                                hideAnimation ? 'opacity-0 translate-y-2' : 'opacity-100'
                            }`}
                        >
                            <div className="alert alert-success relative max-w-md w-full p-6 rounded-xl shadow-md">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-2 right-2 btn btn-xs btn-ghost text-lg p-1"
                                    aria-label="Close"
                                >
                                    <FontAwesomeIcon icon={faXmark}/>
                                </button>
                                <p className="text-sm whitespace-pre-wrap break-words">
                                    {recipes.notes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default AiGeneratedMeal;