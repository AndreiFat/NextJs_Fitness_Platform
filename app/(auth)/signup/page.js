import {signup} from "@/app/(auth)/actions";

export const metadata = {
    title: "Sign Up",
    description: "Page for Sign Up",
};

export default function SignUpPage() {

    return (
        <div>
            <p>Hello there! Welcome abroad!</p>

            <form className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
                {/*Username*/}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">What is your name?</legend>
                    <input name="name" id="name" type="text" className="input" placeholder="Type here"/>
                </fieldset>

                {/*Phone*/}
                <label className="input validator">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <g fill="none">
                            <path
                                d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                                fill="currentColor"></path>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                                  fill="currentColor"></path>
                        </g>
                    </svg>
                    <input name="phone" id="phone" type="tel" className="tabular-nums" required placeholder="Phone"
                           pattern="[0-9]*"
                           minLength="10" maxLength="10" title="Must be 10 digits"/>
                </label>
                <div className="validator-hint">Must be 10 digits</div>

                {/*Email*/}
                <label className="input validator">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none"
                           stroke="currentColor">
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input name="email" id="email" type="email" placeholder="mail@site.com" required/>
                </label>
                <div className="validator-hint hidden">Enter valid email address</div>

                {/*Password*/}
                <label className="input validator">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none"
                           stroke="currentColor">
                            <path
                                d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        </g>
                    </svg>
                    <input name="password" id="password" type="password" required placeholder="Password" minLength="8"
                           pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                           title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
                </label>
                <p className="validator-hint hidden">
                    Must be more than 8 characters, including
                    <br/>At least one number
                    <br/>At least one lowercase letter
                    <br/>At least one uppercase letter
                </p>

                <button
                    formAction={signup}
                    className="w-full ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
}
