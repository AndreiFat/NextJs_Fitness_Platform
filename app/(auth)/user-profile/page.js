import {saveUserProfile} from "@/app/(auth)/actions";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";
import {redirect} from "next/navigation";
import UserProfileInput from "@/components/auth/forms/UserProfileInput";
import React from "react";

export const metadata = {
    title: "User Profile Page",
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
        <div className="min-h-screen bg-base-200 py-10 flex justify-center pt-[100px]">
            <div className="w-full max-w-5xl bg-base-100 p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-2">User Profile</h1>
                <p className="text-center text-base-content/70 mb-8">
                    Complete your profile so we can personalize your fitness plan.
                </p>

                <form action={saveUserProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <UserProfileInput
                            label="What is your age?"
                            name="age"
                            type="number"
                            placeholder="23 years old"
                        />
                        <UserProfileInput
                            label="Weight (kg)"
                            name="initial_weight"
                            type="number"
                            placeholder="75"
                        />
                        <UserProfileInput
                            label="Height (cm)"
                            name="height"
                            type="number"
                            placeholder="175"
                        />
                        <UserProfileInput
                            label="Abdominal Circumference (cm)"
                            name="initial_abdominal_circumference"
                            type="number"
                            placeholder="78"
                        />
                        <UserProfileInput
                            label="Hip Circumference (cm)"
                            name="initial_hip_circumference"
                            type="number"
                            placeholder="93"
                        />

                        {/* Gender */}
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">Gender</legend>
                            <select
                                name="gender"
                                className="select select-bordered w-full"
                                defaultValue="male"
                                required
                            >
                                <option value="null">Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        {/* Activity level */}
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">Activity Level</legend>
                            <select
                                name="activity_level"
                                className="select select-bordered w-full"
                                defaultValue="sedentary"
                                required
                            >
                                <option value="sedentary">Sedentary (little or no exercise)</option>
                                <option value="light">Light activity (1–3 days/week)</option>
                                <option value="moderate">Moderate activity (3–5 days/week)</option>
                                <option value="heavy">Heavy activity (6–7 days/week)</option>
                                <option value="intense">Very intense (twice daily or physical job)</option>
                            </select>
                        </div>
                    </div>

                    {/* Fitness Goals as Selectable Cards */}
                    <div className="mt-10">
                        <label className="label mb-2">
                            <span className="label-text font-medium text-lg">Choose your fitness goal</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                {value: "Muscle Gain", icon: "💪"},
                                {value: "Weight loss", icon: "⚖️"},
                                {value: "Maintenance", icon: "🛠️"},
                                {value: "Performance & Endurance", icon: "🏃‍♂️"},
                                {value: "Flexibility & Mobility", icon: "🧘‍♂️"},
                                {value: "General Fitness & Well-being", icon: "🌿"},
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

                    {/* Notes */}
                    <div className="form-control mt-8">
                        <legend className="text-sm font-medium mb-1">Any notes? (Optional)</legend>
                        <textarea
                            name="notes"
                            className="textarea h-24 w-full px-5 py-3 "
                            placeholder="Type your notes..."
                            defaultValue={userProfile?.notes || ""}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-6"
                    >
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
}