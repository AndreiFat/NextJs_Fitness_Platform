import {createSupabaseServerClient} from "@/utils/supabase/server";
import {sendPasswordReset, updateUserProfile} from "@/app/(auth)/actions";
import EmailInput from "@/components/auth/forms/EmailInput";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";
import UserProfileInput from "@/components/auth/forms/UserProfileInput";
import PhoneInput from "@/components/auth/forms/PhoneInput";
import {redirect} from "next/navigation";

export const metadata = {
    title: "accountSettings",
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
        .from('fitness_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

    if (!userProfile) {
        redirect("/user-profile");
    }

    if (fitnessError) {
        console.error("Error fetching fitnessGoals:", fitnessError);
    }

    return (
        <div>
            <h1>accountSettings</h1>
            <p>This is the accountSettings page.</p>

            <form className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-2">

                {/*Username*/}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">What is your name?</legend>
                    <input name="name" id="name" type="text" className="input w-full" placeholder="Type here"
                           defaultValue={user?.user_metadata.username || ""}/>
                </fieldset>

                <EmailInput value={user?.email}/>
                <PhoneInput value={user?.user_metadata.phone}/>
                <UserProfileInput label="What is your age?" name="age" type="number" placeholder="23 years old"
                                  value={userProfile?.age}/>
                <UserProfileInput label="Enter your weight here:" name="weight" type="number" placeholder="75 kg"
                                  value={userProfile?.weight}/>
                <UserProfileInput label="Enter your height here:" name="height" type="number" placeholder="175 cm"
                                  value={userProfile?.height}/>
                <UserProfileInput label="What is your abdominal circumference?" name="abdominal_circumference"
                                  type="number"
                                  placeholder="78 cm" value={userProfile?.abdominal_circumference}/>
                <UserProfileInput label="What is your hip circumference?" name="hip_circumference" type="number"
                                  placeholder="93 cm" value={userProfile?.hip_circumference}/>

                {/* Fitness Goal Type */}
                <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium text-gray-700">What is your fitness goal?</label>

                    {["Muscle Gain", "Weight loss", "Maintenance", "Performance & Endurance", "Flexibility & Mobility", "General Fitness & Well-being"].map(goal => (
                        <div className="flex items-center space-x-2" key={goal}>
                            <label>
                                <input type="radio" name="goal_type" value={goal} className="radio radio-secondary"
                                       defaultChecked={fitnessGoals?.goal_type === goal}/>
                                <span className="pl-2">{goal}</span>
                            </label>
                        </div>
                    ))}
                </div>

                {/*Notes - optional*/}
                <div>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">If you have any notes, enter them here</legend>
                        <input name="notes" id="notes" type="text" className="input" placeholder="Type here"
                               defaultValue={userProfile?.notes || ""}/>
                        <p className="fieldset-label">Optional</p>
                    </fieldset>
                </div>

                <button
                    formAction={updateUserProfile}
                    type="submit"
                    className="w-50 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Update Profile
                </button>
            </form>


            {user.identities[0].provider === "google" ? (<></>) :
                <div className={"flex justify-center p-4"}>
                    <div className="w-full grid grid-cols-4 gap-4">
                        <form action={sendPasswordReset}>
                            <EmailInput/>
                            <button type={"submit"} className={"btn btn-soft btn-accent mt-3"}>Reset Password</button>
                        </form>
                    </div>
                </div>}
        </div>
    );
}