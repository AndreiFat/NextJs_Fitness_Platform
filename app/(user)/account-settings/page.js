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
            className="min-h-screen bg-base-200 py-10 flex justify-center pt-[100px] bg-linear-to-t from-primary/25 to-base-100">
            <div className="w-full max-w-5xl bg-base-200/50 p-10 shadow-md card backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-center mb-2">Account Settings</h1>
                <p className="text-center text-base-content/70 mb-8">
                    Manage and update your profile details below.
                </p>
                <form action={updateUserProfile}>
                    {/* Grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Name */}
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">Name</legend>
                            <input
                                name="name"
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Your name"
                                defaultValue={userProfile.user.full_name || ""}
                            />
                        </div>

                        {/* Age */}
                        <UserProfileInput
                            label="Your age"
                            name="age"
                            type="number"
                            placeholder="23 years old"
                            value={userProfile?.age}
                        />

                        <EmailInput value={user?.email}/>
                        <PhoneInput value={userProfile.user.phone}/>

                        {/* Gender */}
                        <div className="form-control">
                            <legend className="text-sm font-medium mb-1">Gender</legend>
                            <select
                                name="gender"
                                className="select select-bordered w-full"
                                defaultValue={userProfile?.gender || "male"}
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
                                defaultValue={userProfile?.activity_level || "sedentary"}
                            >
                                <option value="sedentary">Sedentary</option>
                                <option value="light">Light (1–3x/week)</option>
                                <option value="moderate">Moderate (3–5x/week)</option>
                                <option value="heavy">Heavy (6–7x/week)</option>
                                <option value="intense">Very intense</option>
                            </select>
                        </div>

                        {/* Weight, Height */}
                        <UserProfileInput
                            label="Weight (kg)"
                            name="initial_weight"
                            type="number"
                            placeholder="75"
                            value={userProfile?.initial_weight}
                        />
                        <UserProfileInput
                            label="Height (cm)"
                            name="height"
                            type="number"
                            placeholder="175"
                            value={userProfile?.height}
                        />
                        <UserProfileInput
                            label="Abdominal Circumference (cm)"
                            name="initial_abdominal_circumference"
                            type="number"
                            placeholder="78"
                            value={userProfile?.initial_abdominal_circumference}
                        />
                        <UserProfileInput
                            label="Hip Circumference (cm)"
                            name="initial_hip_circumference"
                            type="number"
                            placeholder="93"
                            value={userProfile?.initial_hip_circumference}
                        />
                    </div>

                    {/* Fitness Goals Cards */}
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

                    {/* Notes */}
                    <div className="form-control mt-8">
                        <legend className="text-sm font-medium mb-1">Notes</legend>
                        <textarea
                            name="notes"
                            className="textarea h-24 w-full px-5 py-3 "
                            placeholder="Type your notes..."
                            defaultValue={userProfile?.notes || ""}
                        />
                        <div className="label text-sm">Optional</div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-6"
                    >
                        Update Profile
                    </button>
                </form>

                {/* Password Reset */}
                {user.identities[0].provider !== "google" && (
                    <div className="mt-12">
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="text-lg font-semibold text-center">Reset Your Password</h3>
                                <p className="text-sm text-center text-base-content/70 mb-4">
                                    We'll send a reset link to your email.
                                </p>
                                <form action={sendPasswordReset} className="space-y-4">
                                    <EmailInput/>
                                    <button type="submit" className="btn btn-accent w-full">
                                        Send Reset Link
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