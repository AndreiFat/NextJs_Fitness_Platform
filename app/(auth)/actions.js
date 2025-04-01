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

    console.log(profile, profileError);

    if (profileError || !profile) {
        revalidatePath('/userProfile', 'page')
        redirect('/userProfile');
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData) {
    const supabase = await createSupabaseServerClient();
    const data = {
        friendly_name: formData.get("name"),
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
    revalidatePath('/')
    redirect(data.url)
}

export async function sendPasswordReset(formData) {
    console.log("Sending reset password");
    const supabase = await createSupabaseServerClient();
    const email = formData.get("email");

    const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getURL()}auth/reset-password`,
    })

    console.log(data, error)

}

export async function resetPassword(prevState, formData) {
    const supabase = await createSupabaseServerClient();
    console.log("Reset password");
    const password = formData.get("new-password");
    const confirmPassword = formData.get("confirm-password");
    if (password !== confirmPassword) {
        return {error: "Passwords do not match."};
    }

    console.log(password)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return {
            error: (
                <>Must be more than 8 characters, including
                    <br/>At least one number
                    <br/>At least one lowercase letter
                    <br/>At least one uppercase letter</>
            )
        };
    }

    const {data, error} = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return {error: error.message};
    } else return {success: "Password updated successfully."};
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
