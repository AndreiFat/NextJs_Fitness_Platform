"use client";

import {useState} from "react";
import {createSupabaseClient} from "@/utils/supabase/client";

export function AddFriend({currentUser}) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const supabase = createSupabaseClient();

    const sendRequest = async () => {
        setStatus("");

        // 1. Get target user by email
        const {data: friendUser, error: userError} = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (userError || !friendUser) {
            return setStatus("Utilizatorul nu a fost gasit.");
        }

        if (friendUser.id === currentUser.id) {
            return setStatus("Nu te poti adauga pe tine.");
        }

        const userId = currentUser.id;
        const friendId = friendUser.id;

        // 2. Check for existing friend request or friendship in both directions
        const {data: existing, error: checkError} = await supabase
            .from("friends")
            .select("id, status")
            .or(
                `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
            )
            .maybeSingle();

        if (existing) {
            if (existing.status === "pending") {
                return setStatus("Cererea de prietenie a fost deja trimisă sau primită.");
            }
            if (existing.status === "accepted") {
                return setStatus("Sunteți deja prieteni.");
            }
            return setStatus("Cererea există deja (posibil a fost respinsă).");
        }

        // 3. Insert new friend request
        const {error: insertError} = await supabase.from("friends").insert({
            user_id: userId,
            friend_id: friendId,
            status: "pending",
        });

        if (insertError) {
            return setStatus("Nu pot trimite cererea de prietenie.");
        }

        setStatus("Cerere de prietenie trimisa!");
        setEmail("");
    };

    return (
        <div className="space-y-2">
            <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Introdu adresa de email a prietenului"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary w-full" onClick={sendRequest}>
                Trimite cererea
            </button>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </div>
    );
}