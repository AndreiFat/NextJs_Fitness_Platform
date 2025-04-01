'use client'
import {useActionState} from "react";
import {resetPassword} from "@/app/(auth)/actions";

// export const metadata = {
//     title: "Update password",
//     description: "Page for Update password",
// };

const initialState = {
    error: '',
    success: '',
}

export default function UpdatePassword(data) {
    const [state, formAction, pending] = useActionState(resetPassword, initialState)

    return (
        <div className="reset-password-page flex justify-center items-center">
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Reset Password</legend>
                <form action={formAction} className="space-y-3">
                    <div>
                        <label className="fieldset-label">New Password</label>
                        <input type="password" className="input validator" required placeholder="New password"
                               name="new-password"
                               minLength="8"
                            // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                               title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
                    </div>
                    <div>
                        <label className="fieldset-label">Confirm Password</label>
                        <input type="password" name={"confirm-password"} className="input" required
                               placeholder="Confirm new password"/>
                    </div>
                    <p aria-live="polite" className={"text-sm text-danger text-error"}>{state?.error}</p>
                    <p aria-live="polite" className={"text-sm text-danger text-success"}>{state?.success}</p>
                    <button disabled={pending} className="btn btn-neutral w-full">Reset Password
                    </button>
                </form>
            </fieldset>
        </div>
    );
}
