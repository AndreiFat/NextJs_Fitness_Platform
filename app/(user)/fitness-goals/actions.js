'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export default async function saveFitnessLog(formData) {
    const supabase = await createSupabaseServerClient();

    const height = formData.get('height');
    const weight = formData.get('weight');
    const abdominal_circumference = formData.get('abdominal_circumference');
    const hip_circumference = formData.get('hip_circumference');
    const IMC = weight / (height * height) * 10000;

    console.log(hip_circumference, abdominal_circumference, weight, IMC, height);

    const {data, error} = await supabase
        .from('metabolic_progress_logs')
        .insert([
            {
                weight: weight,
                abdominal_circumference: abdominal_circumference,
                hip_circumference: hip_circumference,
                IMC: IMC
            }
        ])
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
} 