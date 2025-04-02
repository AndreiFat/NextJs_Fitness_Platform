import React from 'react';

function UserProfileInput({label, name, type = "number", placeholder, value}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                name={name}
                id={name}
                type={type}
                className="input validator"
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