import {createSupabaseServerClient} from "@/utils/supabase/server";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import FormInput from "@/components/auth/forms/FormInput";
import SaveButton from "@/components/shop/products/SaveButton";
import saveFitnessLog, {generateMealPlan, generateWorkoutPlan} from "@/app/(user)/fitness-goals/actions";
import React from "react";
import IMCProgressChart from "@/components/charts/IMCProgressChart";
import FitnessComposedChart from "@/components/charts/FitnessComposedChart";
import CircumferenceComparisonChart from "@/components/charts/CircumferenceComparisonChart";

export const metadata = {
    title: "FitnessGoals",
    description: "Page for FitnessGoals",
};

export default async function FitnessGoals() {
    const supabase = await createSupabaseServerClient();

    const {data: {user}, error} = await supabase.auth.getUser();

    if (error) {
        console.error("Error fetching user:", error);
    }

    const userProfile = await getUserProfile(user.id);

    const initialDate = userProfile.created_at;
    const formattedDate = new Date(initialDate).toLocaleDateString("ro-RO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const {data: fitness_goals, fitnessError} = await supabase
        .from('fitness_goals')
        .select('initial_IMC')
        .eq("user_id", user.id)
        .maybeSingle()

    const {data: metabolic_progress_logs, logError} = await supabase
        .from('metabolic_progress_logs')
        .select('*')
        .eq("user_id", user.id)

    if (logError) {
        console.error("Error fetching logs:", logError);
    }

    // BMR and caloric recommendation calculation
    const gender = userProfile.gender;
    const weight = userProfile.initial_weight;
    const height = userProfile.height;
    const age = userProfile.age;
    const activityLevel = userProfile.activity_level;

    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        heavy: 1.725,
        very_intense: 1.9
    };

    const bmr = gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
    const recommendedCalories = Math.round(tdee);

    const chartData = [
        {
            date: "Inițial",
            imc: Number(fitness_goals.initial_IMC),
        },
        ...metabolic_progress_logs.map(log => ({
            date: new Date(log.created_at).toLocaleDateString("ro-RO"),
            imc: Number(log.IMC),
        }))
    ];

    const fitnessComposedChart = [
        {
            date: "Inițial",
            imc: Number(fitness_goals.initial_IMC),
            weight: userProfile.initial_weight,
            height: userProfile.height,
        },
        ...metabolic_progress_logs.map(log => ({
            date: new Date(log.created_at).toLocaleDateString("ro-RO"),
            imc: Number(log.IMC),
            weight: log.weight,
            height: userProfile.height, // height doesn't usually change
        }))
    ];

    const circumferenceChartData = [
        {
            date: "Inițial",
            abdominal_circumference: userProfile.initial_abdominal_circumference,
            hip_circumference: userProfile.initial_hip_circumference,
        },
        ...metabolic_progress_logs.map(log => ({
            date: new Date(log.created_at).toLocaleDateString("ro-RO"),
            abdominal_circumference: log.abdominal_circumference,
            hip_circumference: log.hip_circumference,
        }))
    ];

    const {plan, videos} = await generateWorkoutPlan("Weight Loss");

    return (
        <>
            <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
                <h2 className="text-xl font-semibold">Fitness Profile</h2>
                <p><strong>Initial weight:</strong> {userProfile.initial_weight} kg</p>
                <p><strong>Initial abdominal circumference:</strong> {userProfile.initial_abdominal_circumference} cm
                </p>
                <p><strong>Initial hip circumference:</strong> {userProfile.initial_hip_circumference} cm</p>
                <p><strong>Initial IMC:</strong> {fitness_goals.initial_IMC}</p>
                <p><strong>Activity level</strong> {userProfile.activity_level}</p>
                <p><strong>Date:</strong> {formattedDate}</p>
            </div>
            <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-2 mt-4">
                <h2 className="text-xl font-semibold">Caloric Recommendation</h2>
                <p><strong>BMR:</strong> {Math.round(bmr)} kcal/day</p>
                <p><strong>Estimated TDEE:</strong> {recommendedCalories} kcal/day</p>
            </div>
            <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-2 mt-4">
                <h2 className="text-xl font-semibold">Suggested Daily Intake</h2>
                <p><strong>For weight loss:</strong> {Math.round(recommendedCalories - 500)} kcal/day</p>
                <p><strong>For maintenance:</strong> {recommendedCalories} kcal/day</p>
                <p><strong>For muscle gain:</strong> {Math.round(recommendedCalories + 300)} kcal/day</p>
            </div>
            <IMCProgressChart data={chartData}/>
            <FitnessComposedChart data={fitnessComposedChart}/>
            <CircumferenceComparisonChart data={circumferenceChartData}/>
            <ModalOpenButton id={"addFitnessLogForm"} buttonName={"Add your progress"}></ModalOpenButton>
            <dialog id={"addFitnessLogForm"} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button
                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Add new progress: </h3>
                    <form id="add-fitness-log-form" action={saveFitnessLog}
                          className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-2">
                        <input type="hidden" id={"height"}
                               name="height"
                               value={userProfile.height}/>
                        <FormInput label="Weight: " name="weight" type="number" placeholder="Weight: "/>
                        <FormInput label="Abdominal circumference: " name="abdominal_circumference" type="number"
                                   placeholder="Abdominal circumference: "/>
                        <FormInput label="Hip circumference: " name="hip_circumference" type="number"
                                   placeholder="Hip circumference: "/>

                        <SaveButton formId="add-fitness-log-form" modalId="addFitnessLogForm" label="Save Log"/>
                    </form>
                </div>
            </dialog>
            <form action={generateMealPlan}>
                <button type="submit" className="btn btn-primary">Ask AI</button>
            </form>
            <form action={generateWorkoutPlan}>
                <button type="submit" className="btn btn-primary">Generate Plan</button>
            </form>
            <div>
                <h1>Your 7-Day Workout Plan</h1>
                <pre>{plan}</pre>

                <h2>Suggested YouTube Videos:</h2>
                {videos.map((dayVideos, index) => (
                    <div key={index}>
                        <h3>Day {index + 1}: {dayVideos.keyword}</h3>
                        <ul>
                            {dayVideos.videos.map((video) => (
                                <li key={video.videoId}>
                                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                                        <img src={video.thumbnail} alt={video.title}/>
                                        <p>{video.title}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Progress Logs</h3>
                {metabolic_progress_logs && metabolic_progress_logs.length > 0 ? (
                    metabolic_progress_logs.map((log) => {
                        const logDate = new Date(log.created_at).toLocaleDateString("ro-RO", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        });

                        return (
                            <div key={log.id} className="p-4 bg-gray-100 rounded-md shadow">
                                <p><strong>Date:</strong> {logDate}</p>
                                <p><strong>Weight:</strong> {log.weight} kg</p>
                                <p><strong>Abdominal Circumference:</strong> {log.abdominal_circumference} cm</p>
                                <p><strong>Hip Circumference:</strong> {log.hip_circumference} cm</p>
                                <p><strong>IMC:</strong> {log.IMC}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No progress logs found.</p>
                )}
            </div>
        </>


    );
}