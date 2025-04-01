import {createSupabaseServerClient} from "@/utils/supabase/server";


export async function getUserRole() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();

    if (!user) return {is_admin: false, error: authError};

    const {data: user_role, error: roleError} = await supabase
        .from('users')
        .select('is_admin')
        .eq("id", user.id)
        .maybeSingle();

    if (roleError) return {is_admin: false, error: roleError};

    return {is_admin: user_role?.is_admin || false, error: null};
}