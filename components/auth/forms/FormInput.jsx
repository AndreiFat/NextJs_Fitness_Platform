import React from 'react';
import InputLabel from "@/components/forms/InputLabel";

function FormInput({label, name, type = "", placeholder, value}) {
    return (
        <div className="w-full">
            <InputLabel label={label}></InputLabel>
            <input
                name={name}
                id={name}
                type={type}
                className="input validator w-full"
                required
                placeholder={placeholder}
                defaultValue={value || ""}
            />
            <p className="validator-hint">Must be at type text</p>
        </div>
    );
}

export default FormInput;