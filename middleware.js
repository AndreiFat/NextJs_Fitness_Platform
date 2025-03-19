import {updateSession} from "@/utils/supabase/middleware";

export async function middleware(request) {
    // Actualizăm sesiunea și obținem răspunsul middleware-ului
    let response = await updateSession(request);
    console.log("Middleware executat pentru:", request.nextUrl.pathname); // Debugging
    return response;
}

export const config = {
    matcher: [
        // Middleware-ul va rula doar pe rutele specificate
        "/fitness/:path*",
    ],
};