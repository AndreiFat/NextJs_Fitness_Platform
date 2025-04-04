import {saveUserProfile} from "@/app/(auth)/actions";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";
import {redirect} from "next/navigation";
import UserProfileInput from "@/components/auth/forms/UserProfileInput";


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
        <>
            <h1>User Profile Page</h1>
            <p>This is the User Profile Page page.</p>

            <form className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-2">
                <UserProfileInput label="What is your age?" name="age" type="number" placeholder="23 years old"/>
                <UserProfileInput label="Enter your weight here:" name="weight" type="number" placeholder="75 kg"/>
                <UserProfileInput label="Enter your height here:" name="height" type="number" placeholder="175 cm"/>
                <UserProfileInput label="What is your abdominal circumference?" name="abdominal_circumference"
                                  type="number" placeholder="78 cm"/>
                <UserProfileInput label="What is your hip circumference?" name="hip_circumference" type="number"
                                  placeholder="93 cm"/>

                {/*Fitness Goal Type*/}
                <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        What is your fitness goal?
                    </label>

                    <div className="flex items-center space-x-2">
                        <label className="">
                            <input id="muscle_gain" type="radio" name="goal_type" value="Muscle Gain"
                                   className="radio radio-secondary"
                                   defaultChecked/>
                            <span className="pl-2">Muscle Gain/Bulking</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label>
                            <input id="weight_loss" type="radio" name="goal_type" value="Weight loss"
                                   className="radio radio-secondary"
                                   defaultChecked/>
                            <span className="pl-2">Weight loss</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label>
                            <input id="maintenance" type="radio" name="goal_type" value="Maintenance"
                                   className="radio radio-secondary"
                                   defaultChecked/>
                            <span className="pl-2">Maintenance</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label>
                            <input id="performance" type="radio" name="goal_type" value="Performance & Endurance"
                                   className="radio radio-secondary"
                                   defaultChecked/>
                            <span className="pl-2">Performance & Endurance</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label>
                            <input id="mobility" type="radio" name="goal_type" value="Flexibility & Mobility"
                                   className="radio radio-secondary"
                                   defaultChecked/>
                            <span className="pl-2">Flexibility & Mobility</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label>
                            <input id="mobility" type="radio" name="goal_type" value="General Fitness & Well-being"
                                   className="radio radio-secondary"
                                   defaultChecked/>
                            <span className="pl-2">General Fitness & Well-being</span>
                        </label>
                    </div>
                </div>

                {/*Notes - optional*/}
                <div>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">If you have any notes, enter them here</legend>
                        <input name="notes" id="notes" type="text" className="input" placeholder="Type here"/>
                        <p className="fieldset-label">Optional</p>
                    </fieldset>
                </div>

                <button
                    formAction={saveUserProfile}
                    type="submit"
                    className="w-50 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Save Profile
                </button>
            </form>
        </>
    );
}