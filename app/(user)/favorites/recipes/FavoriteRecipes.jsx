import React from "react";
import CollapseComponentMeals from "@/components/ai-assistant/CollapseComponentMeals";
import FavoriteButton from "@/components/ai-assistant/buttons/FavoriteButton";

export const metadata = {
    title: "Favorite Recipes",
    description: "Page for Favorite Recipes",
};

export default async function FavoriteRecipes({recipes}) {

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Favorite Recipes</h1>
            <p className="text-base-content/75 mb-6">Here are the delicious meals you've saved!</p>
            <div
                className={`grid grid-cols-1 ${recipes.length > 1 ? 'lg:grid-cols-2' : 'md:grid-cols-1'} gap-4 items-stretch`}>
                {recipes.map((recipe, index) => {
                    const itemHash = recipe.item_hash;

                    return (
                        <div key={index} className="card">
                            <div className="card-body bg-base-100/75 rounded-xl">
                                <h2 className="card-title font-semibold flex justify-between">
                                    {recipe.item.day}
                                    <FavoriteButton
                                        type="meal"
                                        item={recipe.item}
                                        itemHash={itemHash}
                                        initiallySaved={true} // It is saved because it’s loaded from favorites
                                    />
                                </h2>

                                <CollapseComponentMeals
                                    index={index}
                                    recipe={recipe.item.breakfast}
                                    mealType="Breakfast"
                                    badgeColor="primary"
                                />
                                <CollapseComponentMeals
                                    index={index}
                                    recipe={recipe.item.lunch}
                                    mealType="Lunch"
                                    badgeColor="secondary"
                                />
                                <CollapseComponentMeals
                                    index={index}
                                    recipe={recipe.item.dinner}
                                    mealType="Dinner"
                                    badgeColor="accent"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}