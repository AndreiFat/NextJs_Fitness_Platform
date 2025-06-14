import React from 'react';

function PasswordInput(props) {
    return (
        <div>
            <legend className="text-sm font-medium mb-1">Parola</legend>
            <label className="input validator w-full">
                <svg className="h-[1.2em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none"
                       stroke="currentColor">
                        <path
                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                </svg>
                <input name="password" id="password" type="password" required placeholder="Parola" minLength="8"
                       pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                       title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
            </label>
            <p className="validator-hint hidden">
                Trebuie să aibă mai mult de 8 caractere, inclusiv
                <br/>Cel puțin o cifră
                <br/>Cel puțin o literă mică
                <br/>Cel puțin o literă mare
            </p>
        </div>
    );
}

export default PasswordInput;