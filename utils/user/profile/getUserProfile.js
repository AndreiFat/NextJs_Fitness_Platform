import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

export async function getUserProfile(userId) {
    const supabase = await createSupabaseServerClient();

    let {data: user_profiles, error} = await supabase
        .from('user_profiles')
        .select('*')
        .eq("id", userId)
        .maybeSingle();

    if (error) {
        console.error(error);
        redirect('/error');
    }

    return user_profiles;
}