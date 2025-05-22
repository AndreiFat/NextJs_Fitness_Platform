import React from 'react';

function SkeletonOnLoad(props) {
    return (
        <div className="flex w-full flex-col gap-4 opacity-40">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>
    );
}

export default SkeletonOnLoad;