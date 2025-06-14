import {saveUserProfile} from "@/app/(auth)/actions";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";
import {redirect} from "next/navigation";
import UserProfileInput from "@/components/auth/forms/UserProfileInput";
import React from "react";

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} — Profilul utilizatorului`,
    description: "Page for User Profile Page",
};

export default async function UserProfilePage() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}, error} = await supabase.auth.getUser();

    if (error) {
        console.error("Error fetching user:", error);
    }

    const userProfile = await getUserProfile(user.id);

    if (userProfile) {
        redirect("/account-settings");
    }

    return (
        <div className="min-h-screen bg-base-200 py-10 flex justify-center pt-32">
            <div className="w-full max-w-5xl bg-base-100 p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-2">Profil Utilizator</h1>
                <p className="text-center text-base-content/70 mb-8">
                    Completează-ți profilul pentru a-ți personaliza planul de fitness.
                </p>

                <form action={saveUserProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <UserProfileInput
                            label="Care este vârsta ta?"
                            name="age"
                            type="number"
                            placeholder="23 ani"
                        />
                        <UserProfileInput
                            label="Greutate (kg)"
                            name="initial_weight"
                            type="number"
                            placeholder="75"
                        />
                        <UserProfileInput
                            label="Înălțime (cm)"
                            name="height"
                            type="number"
                            placeholder="175"
                        />
                        <UserProfileInput
                            label="Circumferință abdominală (cm)"
                            name="initial_abdominal_circumference"
                            type="number"
                            placeholder="78"
                        />
                        <UserProfileInput
                            label="Circumferință șold (cm)"
                            name="initial_hip_circumference"
                            type="number"
                            placeholder="93"
                        />

                        {/* Gen */}
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">Gen</legend>
                            <select
                                name="gender"
                                className="select select-bordered w-full"
                                defaultValue="male"
                                required
                            >
                                <option value="null">Selectează genul tău</option>
                                <option value="male">Masculin</option>
                                <option value="female">Feminin</option>
                            </select>
                        </div>

                        {/* Nivel de activitate */}
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">Nivel de activitate</legend>
                            <select
                                name="activity_level"
                                className="select select-bordered w-full"
                                defaultValue="sedentary"
                                required
                            >
                                <option value="sedentary">Sedentar (puțină sau fără activitate fizică)</option>
                                <option value="light">Activitate ușoară (1–3 zile pe săptămână)</option>
                                <option value="moderate">Activitate moderată (3–5 zile pe săptămână)</option>
                                <option value="heavy">Activitate intensă (6–7 zile pe săptămână)</option>
                                <option value="intense">Foarte intens (de două ori pe zi sau job fizic)</option>
                            </select>
                        </div>
                    </div>

                    {/* Obiective fitness ca carduri selectabile */}
                    <div className="mt-10">
                        <label className="label mb-2">
                            <span className="label-text font-medium text-lg">Alege-ți obiectivul de fitness</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                {value: "Creștere musculară", icon: "💪"},
                                {value: "Slăbire", icon: "⚖️"},
                                {value: "Menținere", icon: "🛠️"},
                                {value: "Performanță & Rezistență", icon: "🏃‍♂️"},
                                {value: "Flexibilitate & Mobilitate", icon: "🧘‍♂️"},
                                {value: "Fitness general & Stare de bine", icon: "🌿"},
                            ].map(({value, icon}) => (
                                <label key={value} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="goal_type"
                                        value={value}
                                        className="hidden peer"
                                        defaultChecked={value === "Muscle Gain"}
                                    />
                                    <div
                                        className="card p-4 border bg-base-100 hover:bg-base-200 peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{icon}</div>
                                            <div className="font-semibold">{value}</div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="form-control mt-8">
                        <legend className="text-sm font-medium mb-1">Note (opțional)</legend>
                        <textarea
                            name="notes"
                            className="textarea h-24 w-full px-5 py-3"
                            placeholder="Scrie notițele tale..."
                            defaultValue={userProfile?.notes || ""}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-6"
                    >
                        Salvează Profilul
                    </button>
                </form>
            </div>
        </div>
    );
}