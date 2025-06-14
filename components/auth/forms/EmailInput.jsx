import React from 'react';

function EmailInput({value}) {
    return (
        <div>
            {/*Email*/}
            <fieldset className="fieldset">
                <legend className="text-sm font-medium">Adresă Email</legend>
                <label className="input validator w-full ">
                    <svg className="h-[1.2em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none"
                           stroke="currentColor">
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input name="email" id="email" type="email" placeholder="mail@site.com" defaultValue={value || ""}
                           required/>
                </label>
            </fieldset>
            <div className="validator-hint hidden">Introdu o adresa de email valida</div>
        </div>
    );
}

export default EmailInput;