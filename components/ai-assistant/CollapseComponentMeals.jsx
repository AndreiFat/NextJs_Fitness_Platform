'use client'
import React from 'react';
import {faClock, faFire} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function CollapseComponentMeals({index, recipe, mealType, badgeColor}) {
    return (
        <div tabIndex={index} className="collapse collapse-plus bg-base-100/90 border border-base-200/50">
            <div className="collapse-title font-semibold flex items-center">
                {recipe.title}
                <div className={`ms-2 badge badge-soft badge-${badgeColor}`}>{mealType}</div>
            </div>
            <div className="collapse-content text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className={"font-semibold text-md"}>Ingredients</h4>
                        {recipe.ingredients.map((ingredient, index) => (
                            <div key={index}>
                                <div
                                    className="rounded-full text-sm bg-base-200 mt-2 px-3 py-2">{ingredient}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h4 className={"font-semibold text-md"}>Instructions</h4>
                        {recipe.instructions.map((instruction, index) => (
                            <div key={index}>
                                <div className="rounded-full text-sm bg-base-200 mt-2 px-3 py-2">{instruction}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h4 className={"font-semibold text-md"}>Energy kCal</h4>
                        <div className="rounded-full text-sm bg-base-200 mt-2 px-3 py-2"><FontAwesomeIcon
                            className="mr-2" size={"lg"}
                            icon={faFire}/> {recipe.calories} kCal
                        </div>
                    </div>
                    <div>
                        <h4 className={"font-semibold text-md"}>Cooking Time</h4>
                        <div className="rounded-full text-sm bg-base-200 mt-2 px-3 py-2"><FontAwesomeIcon size={"lg"}
                                                                                                          className="mr-2"
                                                                                                          icon={faClock}/>{recipe.cooking_time}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CollapseComponentMeals;