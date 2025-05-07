'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function updateReview() {
    console.log("se incearca editul")
}

export async function deleteReview(formData) {
    console.log("se incearca delete review")
    const supabase = await createSupabaseServerClient();

    const reviewId = formData.get("reviewId");

    const {error} = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)

    revalidatePath('/', 'layout');
}

export async function saveReview(formData) {
    console.log("se incearca save review")
    const supabase = await createSupabaseServerClient();

    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        stars: formData.get("stars"),
        product_id: formData.get("product_id")
    }

    const {error} = await supabase
        .from('reviews')
        .insert(data)
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}