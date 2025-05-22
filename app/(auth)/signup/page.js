import {signup} from "@/app/(auth)/actions";
import EmailInput from "@/components/auth/forms/EmailInput";
import PhoneInput from "@/components/auth/forms/PhoneInput";
import PasswordInput from "@/components/auth/forms/PasswordInput";
import React from "react";
import Link from "next/link";

export const metadata = {
    title: "Sign Up",
    description: "Page for Sign Up",
};

export default function SignUpPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-base-200 bg-linear-to-t from-primary/20 to-base-100">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body space-y-3">
                    <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                    <p className="text-center text-sm text-base-content/70">
                        Hello there! Welcome aboard!
                    </p>

                    <form className="space-y-4" action={signup}>
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">What is your name?</legend>
                            <input
                                name="name"
                                id="name"
                                type="text"
                                placeholder="Type your full name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <PhoneInput/>
                        <EmailInput/>
                        <PasswordInput/>

                        <div className="text-center">
                            <p className="text-sm">
                                Already have an account?
                                <Link href="/login" className="link link-primary ml-1">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <div className="form-control mt-4">
                            <button type="submit" className="btn btn-primary w-full">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}