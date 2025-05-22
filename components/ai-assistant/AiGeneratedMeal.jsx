'use client'
import React, {useEffect, useState} from 'react';
import CollapseComponent from "@/components/ai-assistant/CollapseComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCookieBite, faXmark} from "@fortawesome/free-solid-svg-icons";

function AiGeneratedMeal({response}) {
    const [showToast, setShowToast] = useState(true);
    const [hideAnimation, setHideAnimation] = useState(false);

    // Trigger auto-close after 60s with animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setHideAnimation(true);
            setTimeout(() => setShowToast(false), 300); // wait for animation before removing
        }, 60000);

        return () => clearTimeout(timer);
    }, []);

    // Manual close handler
    const handleClose = () => {
        setHideAnimation(true);
        setTimeout(() => setShowToast(false), 300); // same animation delay
    };

    return (
        <div>
            {response.map((recipes, index) => (
                <div
                    key={index}
                    className={`grid grid-cols-1 ${recipes.days.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}
                >
                    {recipes.days.map((recipe, index) => (
                        <div key={index} className="card">
                            <div className="card-body bg-base-100/75 rounded-xl">
                                <h2 className="card-title font-semibold">{recipe.day}</h2>
                                <CollapseComponent
                                    index={index}
                                    recipe={recipe.breakfast}
                                    mealType="Breakfast"
                                    badgeColor="primary"
                                />
                                <CollapseComponent
                                    index={index}
                                    recipe={recipe.lunch}
                                    mealType="Lunch"
                                    badgeColor="secondary"
                                />
                                <CollapseComponent
                                    index={index}
                                    recipe={recipe.dinner}
                                    mealType="Dinner"
                                    badgeColor="accent"
                                />
                                <div className="divider divider-primary">Snacks</div>
                                <div className="card card-sm bg-base-200/75 rounded-xl">
                                    <div className="card-body">
                                        <p className="text-sm">
                                            <FontAwesomeIcon icon={faCookieBite} size="lg" className="me-3"/>
                                            {recipe.snacks}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {showToast && recipes.notes && (
                        <div
                            className={`toast transition-all duration-300 ease-in-out ${
                                hideAnimation ? 'opacity-0 translate-y-2' : 'opacity-100'
                            }`}
                        >
                            <div className="alert alert-success relative max-w-md w-full p-6 rounded-xl shadow-md">
                                {/* Close button in top-right corner */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-2 right-2 btn btn-xs btn-ghost text-lg p-1"
                                    aria-label="Close"
                                >
                                    <FontAwesomeIcon icon={faXmark}/>
                                </button>

                                {/* Multi-line text content */}
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