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
            return setStatus("User not found");
        }

        if (friendUser.id === currentUser.id) {
            return setStatus("Cannot add yourself");
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
                return setStatus("Friend request already sent or received.");
            }
            if (existing.status === "accepted") {
                return setStatus("You are already friends.");
            }
            return setStatus("Request exists (maybe rejected).");
        }

        // 3. Insert new friend request
        const {error: insertError} = await supabase.from("friends").insert({
            user_id: userId,
            friend_id: friendId,
            status: "pending",
        });

        if (insertError) {
            return setStatus("Could not send request.");
        }

        setStatus("Friend request sent!");
        setEmail("");
    };

    return (
        <div className="space-y-2 max-w-md">
            <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter user's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary w-full" onClick={sendRequest}>
                Send Friend Request
            </button>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </div>
    );
}