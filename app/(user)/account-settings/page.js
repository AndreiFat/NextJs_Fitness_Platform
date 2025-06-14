import {createSupabaseServerClient} from "@/utils/supabase/server";
import {sendPasswordReset, updateUserProfile} from "@/app/(auth)/actions";
import EmailInput from "@/components/auth/forms/EmailInput";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";
import UserProfileInput from "@/components/auth/forms/UserProfileInput";
import PhoneInput from "@/components/auth/forms/PhoneInput";
import {redirect} from "next/navigation";
import React from "react";

export const metadata = {
    title: "Account Settings",
    description: "Page for account-settings",
};

export default async function accountSettings() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}, error} = await supabase.auth.getUser();

    if (error || !user) {
        return <p>Error loading user data.</p>;
    }

    const userProfile = await getUserProfile(user.id);

    const {data: fitnessGoals, error: fitnessError} = await supabase
        .from("fitness_goals")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!userProfile) {
        redirect("/user-profile");
    }

    if (fitnessError) {
        console.error("Error fetching fitnessGoals:", fitnessError);
    }

    return (
        <div
            className="min-h-screen bg-base-200 py-10 flex justify-center pt-[100px] bg-gradient-to-t from-primary/25 to-base-100">
            <div className="w-full max-w-5xl bg-base-200/50 p-10 shadow-md card backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-center mb-2">Setări cont</h1>
                <p className="text-center text-base-content/70 mb-8">
                    Gestionează și actualizează detaliile contului tău mai jos.
                </p>

                <form action={updateUserProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Nume */}
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">Nume</legend>
                            <input
                                name="name"
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Numele tău"
                                defaultValue={userProfile.user.full_name || ""}
                            />
                        </div>

                        {/* Vârstă */}
                        <UserProfileInput
                            label="Vârsta ta"
                            name="age"
                            type="number"
                            placeholder="23 ani"
                            value={userProfile?.age}
                        />

                        <EmailInput value={user?.email}/>
                        <PhoneInput value={userProfile.user.phone}/>

                        {/* Gen */}
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">Gen</legend>
                            <select
                                name="gender"
                                className="select select-bordered w-full"
                                defaultValue={userProfile?.gender || "male"}
                            >
                                <option value="null">Selectează genul</option>
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
                                defaultValue={userProfile?.activity_level || "sedentary"}
                            >
                                <option value="sedentary">Sedentar</option>
                                <option value="light">Ușor (1–3x/săptămână)</option>
                                <option value="moderate">Moderat (3–5x/săptămână)</option>
                                <option value="heavy">Intens (6–7x/săptămână)</option>
                                <option value="intense">Foarte intens</option>
                            </select>
                        </div>

                        {/* Greutate, Înălțime, Circumferințe */}
                        <UserProfileInput
                            label="Greutate (kg)"
                            name="initial_weight"
                            type="number"
                            placeholder="75"
                            value={userProfile?.initial_weight}
                        />
                        <UserProfileInput
                            label="Înălțime (cm)"
                            name="height"
                            type="number"
                            placeholder="175"
                            value={userProfile?.height}
                        />
                        <UserProfileInput
                            label="Circumferință abdominală (cm)"
                            name="initial_abdominal_circumference"
                            type="number"
                            placeholder="78"
                            value={userProfile?.initial_abdominal_circumference}
                        />
                        <UserProfileInput
                            label="Circumferință șold (cm)"
                            name="initial_hip_circumference"
                            type="number"
                            placeholder="93"
                            value={userProfile?.initial_hip_circumference}
                        />
                    </div>

                    {/* Obiective Fitness */}
                    <div className="mt-10">
                        <label className="label mb-2">
                            <span className="label-text font-medium text-lg">Alege obiectivul tău</span>
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
                                        defaultChecked={fitnessGoals?.goal_type === value}
                                    />
                                    <div
                                        className="p-4 card w-full text-start border border-base-content bg-base-100 hover:bg-base-200 peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="text-xl">{icon}</div>
                                            <div className="font-semibold">{value}</div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Notițe */}
                    <div className="form-control mt-8">
                        <legend className="text-sm font-medium mb-1">Notițe</legend>
                        <textarea
                            name="notes"
                            className="textarea h-24 w-full px-5 py-3"
                            placeholder="Scrie notițele tale..."
                            defaultValue={userProfile?.notes || ""}
                        />
                        <div className="label text-sm">Opțional</div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-6"
                    >
                        Actualizează profilul
                    </button>
                </form>

                {/* Resetare parolă */}
                {user.identities[0].provider !== "google" && (
                    <div className="mt-12">
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="text-lg font-semibold text-center">Resetează parola</h3>
                                <p className="text-sm text-center text-base-content/70 mb-4">
                                    Îți vom trimite un link de resetare pe email.
                                </p>
                                <form action={sendPasswordReset} className="space-y-4">
                                    <EmailInput/>
                                    <button type="submit" className="btn btn-accent w-full">
                                        Trimite linkul de resetare
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}