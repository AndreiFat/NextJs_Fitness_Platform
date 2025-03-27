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

    const {data: session, error} = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error(error);
        redirect('/error')
    }

    const {data: profile, error: profileError} = await supabase
        .from('user_profiles')
        .select('*')
        .eq("id", session.user.id)
        .maybeSingle();

    //console.log("profile" + profile.weight);

    if (profileError || !profile) {
        redirect('/userProfile');
        return;
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData) {
    const supabase = await createSupabaseServerClient();
    const data = {
        username: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        password: formData.get("password")
    };
    console.log(data)
    const {error} = await supabase.auth.signUp(data)

    if (error) {
        console.error(error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function signInWithGoogle() {
    const supabase = await createSupabaseServerClient();
    console.log(getURL())

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${getURL()}auth/callback`,
        },
    });

    if (error) {
        console.error(error);
        redirect('/error');
    }
    //revalidatePath('/')
    redirect(data.url)
}

const getURL = () => {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    return url
}
