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
        <div className="reset-password-page flex justify-center items-center p-32">
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Reseteaza parola</legend>
                <form action={formAction} className="space-y-3">
                    <div>
                        <label className="fieldset-label">Parola noua</label>
                        <input
                            type="password"
                            className="input validator"
                            required
                            placeholder="Parola noua"
                            name="new-password"
                            minLength="8"
                            title="Trebuie sa contina cel putin 8 caractere, inclusiv o cifra, o litera mica si una mare"
                        />
                    </div>
                    <div>
                        <label className="fieldset-label">Confirma parola</label>
                        <input
                            type="password"
                            name="confirm-password"
                            className="input"
                            required
                            placeholder="Confirma parola noua"
                        />
                    </div>
                    <p aria-live="polite" className="text-sm text-danger text-error">{state?.error}</p>
                    <p aria-live="polite" className="text-sm text-success">{state?.success}</p>
                    <button disabled={pending} className="btn btn-neutral w-full">Reseteaza parola</button>
                </form>
            </fieldset>
        </div>
    );
}
