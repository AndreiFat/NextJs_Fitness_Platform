import {login} from "@/app/(auth)/actions";
import LoginWithGoogleButton from "@/components/auth/LoginWithGoogleButton";
import Link from "next/link";
import EmailInput from "@/components/auth/forms/EmailInput";
import PasswordInput from "@/components/auth/forms/PasswordInput";

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} — Autentificare`,
    description: "Page for Login",
};

export default function LoginPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-base-200 bg-linear-to-t from-primary/20 to-base-100">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body space-y-3">
                    <h2 className="text-2xl font-bold text-center">Autentificare</h2>

                    <form className="space-y-4" action={login}>
                        <EmailInput/>
                        <PasswordInput/>

                        <div className="form-control">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                            >
                                Autentificare
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm">
                                Nu ai un cont?
                                <Link href="/signup" className="link link-primary ml-1">
                                    Inregistreaza-te
                                </Link>
                            </p>
                        </div>
                    </form>

                    <div className="divider">sau</div>

                    <LoginWithGoogleButton/>
                </div>
            </div>
        </div>
    );
}