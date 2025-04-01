import {login} from "@/app/(auth)/actions";
import LoginWithGoogleButton from "@/components/auth/LoginWithGoogleButton";
import Link from "next/link";
import EmailInput from "@/components/auth/forms/EmailInput";
import PasswordInput from "@/components/auth/forms/PasswordInput";

export const metadata = {
    title: "Login",
    description: "Page for Login",
};

export default function LoginPage() {
    return (
        <div>
            <form className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
                <EmailInput/>
                <PasswordInput/>

                <div className="flex justify-between">
                    <button
                        formAction={login}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Log in
                    </button>

                    <Link href={"/signup"}
                          className="w-full ml-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200 text-center"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
            <div className="flex justify-center mt-3">
                <LoginWithGoogleButton/>
            </div>
        </div>
    )
}
