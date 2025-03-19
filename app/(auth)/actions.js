'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export async function login(formData) {
    const supabase = await createSupabaseServerClient();

    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const {error} = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error(error);
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData) {
    const supabase = await createSupabaseServerClient();
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    console.log(data)
    const {error} = await supabase.auth.signUp(data)

    if (error) {
        console.error(error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}


