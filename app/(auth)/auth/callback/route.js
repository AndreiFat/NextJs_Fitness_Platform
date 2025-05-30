import {NextResponse} from 'next/server'
// The client you created from the Server-Side Auth instructions
import {createSupabaseServerClient} from '@/utils/supabase/server'
import {redirect} from "next/navigation";
import {getUserProfile} from "@/utils/user/profile/getUserProfile";

export async function GET(request) {
    const {searchParams, origin} = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createSupabaseServerClient()
        const {error} = await supabase.auth.exchangeCodeForSession(code)
        const {data: userData, error: userError} = await supabase.auth.getUser();
        console.log("User ID after session exchange:", userData.user.id);

        const userId = userData.user.identities[0].user_id;

        const hasUserProfile = await getUserProfile(userId);

        if (!hasUserProfile)
            redirect('/user-profile')

        console.log(error)
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
