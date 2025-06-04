import React from 'react';

function CollapseComponentWorkouts({index, workout}) {
    return (
        <div tabIndex={index} className="collapse collapse-plus bg-base-100/90 border border-base-200/50">
            <div className="collapse-title font-semibold flex items-center">
                {workout.name}
                {/*<div className={`ms-2 badge badge-soft badge-${badgeColor}`}>{mealType}</div>*/}
            </div>
            <div className="collapse-content text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className={"font-semibold text-md"}>Repetari</h4>
                        <div className="rounded-full text-sm bg-base-200 mt-2 px-3 py-2">{workout.reps}</div>
                    </div>
                    <div>
                        <h4 className={"font-semibold text-md"}>Seturi</h4>
                        <div className="rounded-full text-sm bg-base-200 mt-2 px-3 py-2">{workout.sets}</div>
                    </div>
                    <div>
                        <h4 className={"font-semibold text-md"}>Timp de odihna</h4>
                        <div className="rounded-full text-sm bg-base-200 mt-2 px-3 py-2">{workout.rest}</div>
                    </div>
                </div>
                <div role="alert" className="alert alert-success alert-soft mt-4">
                    <span>{workout.notes}</span>
                </div>
            </div>
        </div>
    );
}

export default CollapseComponentWorkouts;