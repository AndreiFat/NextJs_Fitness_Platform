import {createSupabaseServerClient} from "@/utils/supabase/server";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";
import React from "react";
import IMCProgressChart from "@/components/charts/IMCProgressChart";
import FitnessComposedChart from "@/components/charts/FitnessComposedChart";
import CircumferenceComparisonChart from "@/components/charts/CircumferenceComparisonChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";

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
        .select('initial_IMC, goal_type')
        .eq("user_id", user.id)
        .maybeSingle()

    const {data: metabolic_progress_logs, logError} = await supabase
        .from('metabolic_progress_logs')
        .select('*')
        .eq("user_id", user.id)

    if (logError) {
        console.error("Error fetching logs:", logError);
    }

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

    //const {plan, videos} = await generateWorkoutPlan("Weight Loss");
    return (
        <div className="flex gap-[2%] flex-wrap content-start">
            <div className="w-1/4 h-3/4">
                <div className="flex gap-[20px] flex-col">
                    <div className="w-auto">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-primary">
                                    <i className="fa-solid fa-user-circle mr-2"></i> Fitness Profile
                                </h2>
                                <div className="space-y-2">
                                    <div><i className="fa-solid fa-weight-scale mr-2 text-accent"/>
                                        <strong>Weight:</strong> {userProfile.initial_weight} kg
                                    </div>
                                    <div><i className="fa-solid fa-ruler mr-2 text-accent"/>
                                        <strong>Abdominal:</strong> {userProfile.initial_abdominal_circumference} cm
                                    </div>
                                    <div><i className="fa-solid fa-ruler-combined mr-2 text-accent"/>
                                        <strong>Hip:</strong> {userProfile.initial_hip_circumference} cm
                                    </div>
                                    <div><i className="fa-solid fa-heart-pulse mr-2 text-accent"/>
                                        <strong>IMC:</strong> {fitness_goals.initial_IMC}</div>
                                    <div><i className="fa-solid fa-person-walking mr-2 text-accent"/>
                                        <strong>Activity:</strong> {userProfile.activity_level}</div>
                                    <div><i className="fa-solid fa-calendar-day mr-2 text-accent"/>
                                        <strong>Date:</strong> {formattedDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-auto">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-secondary">
                                    <i className="fa-solid fa-fire-flame-curved mr-2"></i> Caloric Recommendation
                                </h2>
                                <div className="stats shadow mt-2">
                                    <div className="stat">
                                        <div className="stat-title">BMR</div>
                                        <div className="stat-value text-accent">{Math.round(bmr)} kcal/day</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">TDEE</div>
                                        <div className="stat-value">{recommendedCalories} kcal/day</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-auto">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-info">
                                    <i className="fa-solid fa-bowl-food mr-2"></i> Suggested Daily Intake
                                </h2>
                                <ul className="mt-2 space-y-1">
                                    <li><i className="fa-solid fa-circle-minus text-warning mr-2"/> <strong>Weight
                                        loss:</strong> {Math.round(recommendedCalories - 500)} kcal/day
                                    </li>
                                    <li><i className="fa-solid fa-scale-balanced text-success mr-2"/>
                                        <strong>Maintenance:</strong> {recommendedCalories} kcal/day
                                    </li>
                                    <li><i className="fa-solid fa-circle-plus text-primary mr-2"/> <strong>Muscle
                                        gain:</strong> {Math.round(recommendedCalories + 300)} kcal/day
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grow h-3/4">
                <div className="flex gap-[20px] flex-wrap">
                    <div className="grow">
                        <div className="card bg-white shadow-xl p-4">
                            <h2 className="font-bold text-lg mb-2">IMC Progress</h2>
                            <IMCProgressChart data={chartData}/>
                        </div>
                    </div>
                    <div className="grow">
                        <div className="card bg-white shadow-xl p-4">
                            <h2 className="font-bold text-lg mb-2">Circumference Comparison</h2>
                            <CircumferenceComparisonChart data={circumferenceChartData}/>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="card bg-white shadow-xl p-4">
                            <h2 className="font-bold text-lg mb-2">Weight & IMC</h2>
                            <FitnessComposedChart data={fitnessComposedChart}/>
                        </div>
                    </div>
                    <div className="grow">
                        <div className="text-center">
                            <p>Do you need a fitness plan based on your fitness profile?</p>
                            <a href={`/ai-assistant?goal=${fitness_goals.goal_type}&calories=${recommendedCalories}`}>
                                <button className="btn btn-primary mt-4 text-white text-lg">
                                    Ask AI
                                    <FontAwesomeIcon icon={faWandMagicSparkles}/>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}