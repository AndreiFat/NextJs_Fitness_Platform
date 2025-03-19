'use client'

import {createSupabaseClient} from "@/utils/supabase/client";

export default function Test({user}) {
    const supabase = createSupabaseClient()
    return <div>
        <pre>Acesta este user-ul din Test Component {JSON.stringify(user)}</pre>
    </div>
}