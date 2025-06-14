import {createSupabaseServerClient} from "@/utils/supabase/server";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";
import React from "react";
import IMCProgressChart from "@/components/charts/IMCProgressChart";
import FitnessComposedChart from "@/components/charts/FitnessComposedChart";
import CircumferenceComparisonChart from "@/components/charts/CircumferenceComparisonChart";
import SaveButton from "@/components/shop/products/SaveButton";
import FormInput from "@/components/auth/forms/FormInput";
import saveFitnessLog from "@/app/(fitness)/fitness/actions";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faCalendarDay,
    faChartLine,
    faFireFlameCurved,
    faHeartPulse,
    faPersonWalking,
    faRuler,
    faRulerCombined,
    faWeight,
    faWeightScale
} from "@fortawesome/free-solid-svg-icons";
import {faUserCircle} from "@fortawesome/free-regular-svg-icons";

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} - Obiective Fitness`,
    description: "Pagina pentru setarea și urmărirea obiectivelor tale de fitness",
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
        // year: "numeric",
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-28 px-8 pb-8">
            {/* Sidebar compact - col-span-4 */}

            <aside className="grid grid-cols-1 lg:col-span-12 gap-6 justify-items-stretch">
                <div
                    className="card bg-gradient-to-br from-primary/10 to-base-100/50 shadow-lg border border-primary/30 transition hover:scale-[1.01] duration-200">
                    <div className="card-body p-5">
                        <div className="flex justify-between items-center">
                            <h2 className="card-title text-primary mb-3">
                                <FontAwesomeIcon icon={faUserCircle} className="mr-2" size="lg"/>
                                Profil Fitness
                            </h2>
                            <ModalOpenButton
                                id="addFitnessLogForm"
                                buttonName="Adaugă progres"
                                className="btn btn-sm btn-outline btn-primary"
                            />
                        </div>

                        <div className="stats stats-vertical sm:stats-horizontal w-full text-sm">
                            <div className="stat">
                                <div className="stat-figure text-primary">
                                    <FontAwesomeIcon icon={faWeightScale} className="text-3xl mt-4"/>
                                </div>
                                <div className="stat-title text-base-content/70">Greutate</div>
                                <div className="stat-value text-primary">{userProfile.initial_weight} kg</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    <FontAwesomeIcon icon={faRuler} className="text-3xl mt-4"/>
                                </div>
                                <div className="stat-title text-base-content/70">Circ. Abdomen</div>
                                <div
                                    className="stat-value text-secondary">{userProfile.initial_abdominal_circumference} cm
                                </div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-accent">
                                    <FontAwesomeIcon icon={faRulerCombined} className="text-3xl mt-4"/>
                                </div>
                                <div className="stat-title text-base-content/70">Circ. Șold</div>
                                <div className="stat-value text-accent">{userProfile.initial_hip_circumference} cm</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-success">
                                    <FontAwesomeIcon icon={faHeartPulse} className="text-3xl mt-4"/>
                                </div>
                                <div className="stat-title text-base-content/70">IMC (Indice de Masă Corporală)</div>
                                <div className="stat-value text-success">{fitness_goals.initial_IMC}</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-info">
                                    <FontAwesomeIcon icon={faPersonWalking} className="text-3xl mt-4"/>
                                </div>
                                <div className="stat-title text-base-content/70">Activitate</div>
                                <div className="stat-value capitalize text-info">{userProfile.activity_level}</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-warning">
                                    <FontAwesomeIcon icon={faCalendarDay} className="text-3xl mt-4"/>
                                </div>
                                <div className="stat-title text-base-content/70">Dată Inițială</div>
                                <div className="stat-value text-warning">{formattedDate}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid cols-span-12 lg:grid-cols-2 gap-6 justify-items-stretch">
                    <div
                        className="card bg-gradient-to-br from-warning/10 to-base-100/50 shadow-lg border border-warning/25 transition hover:scale-[1.01] duration-200">
                        <div className="card-body p-5">
                            <h2 className="card-title text-warning">
                                <FontAwesomeIcon icon={faFireFlameCurved} className="mr-2" size="lg"/> Calorii &
                                Obiective
                            </h2>

                            {/* Stats principale BMR/TDEE */}
                            <div className="stats stats-vertical sm:stats-horizontal w-full text-sm">
                                <div className="stat">
                                    <div className="stat-title text-base-content/70">BMR (Rata Metabolică Bazală)</div>
                                    <div className="stat-value text-orange-500">{Math.round(bmr)} kCal</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title text-base-content/70">TDEE (Consumul Energetic Zilnic
                                        Total)
                                    </div>
                                    <div className="stat-value text-orange-500">{recommendedCalories} kCal</div>
                                </div>
                            </div>

                            <div className="divider m-0"/>

                            {/* Obiective */}
                            <div className="stats stats-vertical sm:stats-horizontal w-full text-sm">
                                <div className="stat">
                                    <div className="stat-title text-base-content/70">Slăbire</div>
                                    <div
                                        className="stat-value text-orange-500">{Math.round(recommendedCalories - 500)} kCal
                                    </div>
                                    <div className="stat-desc text-error">↘︎ 500 kCal (14%)</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title text-base-content/70">Menținere</div>
                                    <div className="stat-value text-orange-500">{recommendedCalories} kCal</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title text-base-content/70">Masă musculară</div>
                                    <div
                                        className="stat-value text-orange-500">{Math.round(recommendedCalories + 300)} kCal
                                    </div>
                                    <div className="stat-desc text-success">↗︎ 300 kCal (12%)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="card bg-gradient-to-br from-info/8 to-base-100/50 border border-accent/25 shadow-md p-6 hover:shadow-lg transition hover:scale-[1.01] duration-200 text-center flex flex-col items-center justify-center">
                        <img src="assets/gemini.png" alt="" className={"h-[48px] mb-4"}/>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500/90 via-blue-400/90 to-cyan-400/90  bg-clip-text text-transparent">
                                Plan AI personalizat pentru tine
                            </h2>
                            <p className="text-base-content/90 mb-6 leading-relaxed text-md">
                                Obține un plan de fitness și nutriție adaptat nevoilor tale cu ajutorul AI-ului.
                            </p>
                        </div>
                        <a href={`/ai-assistant?goal=${fitness_goals.goal_type}&calories=${recommendedCalories}`}>
                            <button
                                className="btn bg-linear-to-r/decreasing bg-cyan-500/50 shadow-cyan-500/30 from-indigo-500/90 to-teal-400/50 hover:border-0 transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] flex items-center gap-2"
                                type="button"
                            >
                                Cere un plan AI acum
                                <FontAwesomeIcon icon={faArrowRight}/>
                            </button>
                        </a>
                    </div>
                </div>
            </aside>

            <main className="lg:col-span-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        className="card bg-gradient-to-br from-secondary/10 to-base-100/50 border border-secondary/50 shadow-md p-5 hover:shadow-lg transition hover:scale-[1.01] duration-200">
                        <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faWeight} size={"lg"}/>
                            Evoluție Greutate & IMC
                        </h3>
                        <FitnessComposedChart data={fitnessComposedChart}/>
                    </div>

                    <div
                        className="card bg-gradient-to-br from-secondary/10 to-base-100/50 border border-secondary/50 shadow-md p-5 hover:shadow-lg transition hover:scale-[1.01] duration-200">
                        <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faChartLine} size={"lg"}/>
                            Evoluția IMC
                        </h3>
                        <IMCProgressChart data={chartData}/>
                    </div>

                    <div
                        className="card bg-gradient-to-br from-secondary/10 to-base-100/50 border border-secondary/50 shadow-md p-5 hover:shadow-lg transition hover:scale-[1.01] duration-200">
                        <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faRulerCombined} size={"lg"}/>
                            Circumferințe
                        </h3>
                        <CircumferenceComparisonChart data={circumferenceChartData}/>
                    </div>
                </div>
            </main>

            <dialog id={"addFitnessLogForm"} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button
                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Adauga progres </h3>
                    <form id="add-fitness-log-form" action={saveFitnessLog}
                          className="mt-6">
                        <input type="hidden" id={"height"}
                               name="height"
                               value={userProfile.height}/>
                        <FormInput label="Weight" name="weight" type="number" placeholder="Weight"/>
                        <FormInput label="Abdominal circumference" name="abdominal_circumference" type="number"
                                   placeholder="Abdominal circumference"/>
                        <FormInput label="Hip circumference" name="hip_circumference" type="number"
                                   placeholder="Hip circumference"/>

                        <SaveButton formId="add-fitness-log-form" modalId="addFitnessLogForm"
                                    label="Salveaza Progresul"/>
                    </form>
                </div>
            </dialog>
        </div>
    );
}