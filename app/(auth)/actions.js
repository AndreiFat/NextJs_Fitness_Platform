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
        revalidatePath('/user-profile', 'page')
        redirect('/user-profile');
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData) {
    const supabase = await createSupabaseServerClient();
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
        options: {
            data: {
                full_name: formData.get("name"),
                phone: formData.get("phone"),
            }
        }
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

export async function saveUserProfile(formData) {
    const supabase = await createSupabaseServerClient();

    const data = {
        age: formData.get("age"),
        weight: formData.get("weight"),
        height: formData.get("height"),
        abdominal_circumference: formData.get("abdominal_circumference"),
        hip_circumference: formData.get("hip_circumference"),
        notes: formData.get("notes"),
        goal_type: formData.get("goal_type"),
    };

    const user = await supabase.auth.getUser();

    const userId = user.data.user.id;

    console.log(data.age);

    const {error} = await supabase
        .from('user_profiles')
        .insert([
            {
                id: userId,
                age: data.age,
                weight: data.weight,
                height: data.height,
                abdominal_circumference: data.abdominal_circumference,
                hip_circumference: data.hip_circumference,
                notes: data.notes
            },
        ])
        .select()

    const IMC = (data.weight / (data.height * data.height)) * 10000;

    const {error: goalError} = await supabase
        .from('fitness_goals')
        .insert([
            {
                user_id: userId,
                goal_type: data.goal_type,
                IMC: IMC
            }
        ]);

    if (goalError) {
        console.error(goalError);
        redirect('/error');
    }

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function updateUserProfile(formData) {
    const supabase = await createSupabaseServerClient();

    const {data: {user}} = await supabase.auth.getUser();

    const userId = user.id;

    const data = {
        username: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        age: formData.get("age"),
        weight: formData.get("weight"),
        height: formData.get("height"),
        abdominal_circumference: formData.get("abdominal_circumference"),
        hip_circumference: formData.get("hip_circumference"),
        notes: formData.get("notes"),
        goal_type: formData.get("goal_type"),
    };

    console.log(data)

    const IMC = (data.weight / (data.height * data.height)) * 10000;

    const {userProfileError} = await supabase
        .from('user_profiles')
        .update({
            age: data.age,
            weight: data.weight,
            height: data.height,
            abdominal_circumference: data.abdominal_circumference,
            hip_circumference: data.hip_circumference,
            notes: data.notes
        })
        .eq('id', userId)
        .select()


    const {fitnessError} = await supabase
        .from('fitness_goals')
        .update({goal_type: data.goal_type, IMC: IMC})
        .eq('user_id', userId)
        .select()

    const {userMetaData, error} = await supabase.auth.updateUser({
        email: data.email,
        data: {
            username: data.username,
            phone: data.phone,
        }
    });

    if (userProfileError) {
        console.error(userProfileError);
        redirect('/error');
    }

    if (fitnessError) {
        console.error(fitnessError);
        redirect('/error');
    }

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');

    return {success: "Data was updated successfully."};
}
