import {signup} from "@/app/(auth)/actions";
import EmailInput from "@/components/auth/forms/EmailInput";
import PhoneInput from "@/components/auth/forms/PhoneInput";
import PasswordInput from "@/components/auth/forms/PasswordInput";

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
                    <input name="name" id="name" type="text" className="input w-full" placeholder="Type here"/>
                </fieldset>

                {/*Phone*/}
                <PhoneInput/>

                {/*Email*/}
                <EmailInput/>

                {/*Password*/}
                <PasswordInput/>

                <button
                    formAction={signup}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
}
