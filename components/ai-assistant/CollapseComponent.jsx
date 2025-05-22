import React from 'react';

function CollapseComponent({index, recipe, mealType, badgeColor}) {
    return (
        <div tabIndex={index} className="collapse collapse-plus bg-base-100/90 border border-base-200/50">
            <div className="collapse-title font-semibold flex items-center">
                {recipe.title}
                <div className={`ms-2 badge badge-soft badge-${badgeColor}`}>{mealType}</div>
            </div>
            <div className="collapse-content text-sm">
                {recipe.ingredients.map((ingredient, index) => (
                    <div key={index}>
                        {ingredient} <br/>
                    </div>
                ))}
                <br/>
                {recipe.calories} kCal <br/>
                {recipe.cooking_time}
                <br/><br/>
                {recipe.instructions.map((instruction, index) => (<div key={index}>
                        {instruction} <br/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollapseComponent;