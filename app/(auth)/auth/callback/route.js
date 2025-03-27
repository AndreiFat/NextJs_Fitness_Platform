import {NextResponse} from 'next/server'
// The client you created from the Server-Side Auth instructions
import {createSupabaseServerClient} from '@/utils/supabase/server'
import {redirect} from "next/navigation";

export async function GET(request) {
    const {searchParams, origin} = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createSupabaseServerClient()
        const {error} = await supabase.auth.exchangeCodeForSession(code)
        const {data: userData, error: userError} = await supabase.auth.getUser();
        console.log("User ID after session exchange:", userData.user.identities[0].user_id);

        const userId = userData.user.identities[0].user_id;

        const hasUserProfile = await checkUserProfile(userId);

        //console.log("User Profile:", hasUserProfile);

        if (!hasUserProfile)
            redirect('/userProfile')

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

export async function checkUserProfile(userId) {
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

    //return profile && profile.weight && profile.height && profile.abdominal_circumference && profile.hip_circumference;
    return user_profiles;
}