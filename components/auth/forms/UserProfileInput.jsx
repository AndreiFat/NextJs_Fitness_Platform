import React from 'react';

function UserProfileInput({label, name, type = "number", placeholder, value}) {
    return (
        <div>
            <legend className="text-sm font-medium mb-1">{label}</legend>
            <input
                name={name}
                id={name}
                type={type}
                className="input validator w-full"
                required
                placeholder={placeholder}
                min="1"
                defaultValue={value || ""}
            />
            <p className="validator-hint">Must be at least 1</p>
        </div>
    );
}

export default UserProfileInput;