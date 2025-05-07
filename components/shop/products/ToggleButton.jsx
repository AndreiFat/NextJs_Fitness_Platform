'use client'

import React from 'react';

const ToggleButton = ({productId, isActive, toggleAction}) => {
    return (
        <form action={toggleAction}>
            <input type="hidden" name="productId" value={productId}/>
            <input type="hidden" name="currentStatus" value={isActive}/>
            <label className="cursor-pointer flex items-center gap-2">
                <input
                    type="checkbox"
                    defaultChecked={isActive}
                    onChange={(e) => e.target.form.requestSubmit()}
                    className="toggle border-red-300 bg-red-100 checked:border-green-300 checked:bg-green-100"
                />
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${
                    isActive
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-red-100 text-red-800 border-red-300'
                }`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </label>
        </form>
    );
};

export default ToggleButton;