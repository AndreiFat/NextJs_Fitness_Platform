"use client";
import {useEffect, useState} from "react";
import {createSupabaseClient} from "@/utils/supabase/client";

export default function UserInfo() {
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = await createSupabaseClient()
            const {data, error} = await supabase.auth.getUser();
            if (data?.user) setUserEmail(data.user.email || "");
        };

        fetchUser();
    }, []);

    return userEmail ? <pre>{userEmail}</pre> : <p>Not logged in</p>;
}