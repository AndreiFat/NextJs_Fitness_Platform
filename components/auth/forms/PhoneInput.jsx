import React from 'react';

function PhoneInput({value}) {
    return (
        <div>
            <fieldset className="fieldset">
                <legend className="text-sm font-medium">Numar de telefon</legend>
                <label className="input validator w-full">
                    <svg className="h-[1.2em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <g fill="none">
                            <path
                                d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                                fill="currentColor"></path>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                                  fill="currentColor"></path>
                        </g>
                    </svg>
                    <input name="phone" id="phone" type="tel" className="tabular-nums" required
                           placeholder="Numar de telefon"
                           pattern="[0-9]*"
                           minLength="10" maxLength="10" defaultValue={value || ""} title="Must be 10 digits"/>
                </label>
            </fieldset>
            <div className="validator-hint hidden">Trebuie sa fie 10 caractere</div>
        </div>
    );
}

export default PhoneInput;