import React from 'react';

function AddressInput({label, name, type = "", placeholder, value}) {
    return (
        <div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                    name={name}
                    id={name}
                    type={type}
                    className="input validator"
                    required
                    placeholder={placeholder}
                    defaultValue={value || ""}
                />
                <p className="validator-hint">Must be at type text</p>
            </div>
        </div>
    );
}

export default AddressInput;