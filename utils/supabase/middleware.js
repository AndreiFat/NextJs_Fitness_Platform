import {createServerClient} from '@supabase/ssr'
import {NextResponse} from 'next/server'
import {getUserRole} from "@/utils/user/getUserRole";

export async function updateSession(request) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value, options}) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({name, value, options}) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )
    const {
        data: {user},
    } = await supabase.auth.getUser()


    const PROTECTED_ROUTES = ["/fitness", "/user-profile", "/auth/reset-password"];
    const ADMIN_ROUTES = ["/admin"];

    if (!user && PROTECTED_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Check if user is admin for /admin routes
    if (ADMIN_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
        const {is_admin} = await getUserRole();

        if (!is_admin) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }
    }

    return supabaseResponse
}