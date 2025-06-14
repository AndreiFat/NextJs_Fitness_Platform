'use client';

import {useEffect, useState} from "react";
import {createSupabaseClient} from "@/utils/supabase/client";

export function FriendRequests({userId}) {
    const [supabase] = useState(() => createSupabaseClient());
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const {data, error} = await supabase
                .from("friends")
                .select("*, sender: user_id(email)")
                .eq("friend_id", userId)
                .eq("status", "pending");
            if (!error) setRequests(data || []);
        };

        fetchRequests();

        const channel = supabase
            .channel("realtime:friend-requests")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "friends",
                    filter: `friend_id=eq.${userId}`,
                },
                async (payload) => {
                    const newRequest = payload.new;
                    if (newRequest.status === "pending") {
                        // Fetch sender's email
                        const {data: senderProfile} = await supabase
                            .from("users")
                            .select("email, full_name")
                            .eq("id", newRequest.user_id)
                            .single();
                        
                        setRequests((prev) => [
                            ...prev,
                            {
                                ...newRequest,
                                sender: {email: senderProfile?.email || "", full_name: senderProfile?.full_name || ""},
                            },
                        ]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase]);

    const respondToRequest = async (senderId, accepted) => {
        const {error} = await supabase
            .from("friends")
            .update({status: accepted ? "accepted" : "rejected"})
            .eq("user_id", senderId)
            .eq("friend_id", userId);

        if (!error) {
            setRequests((prev) => prev.filter((r) => r.user_id !== senderId));
        }
    };

    return (
        <div className="space-y-4">
            {requests.length === 0 && <p className="text-sm">No incoming requests.</p>}
            {requests.map((req) => (
                <div key={req.id} className="flex justify-between items-center p-3 rounded-xl bg-base-200 w-full">
                    <div>
                        <div className={"font-semibold"}>{req.sender?.full_name || req.user_id}</div>
                        <div className={"font-sm text-base-content/75"}>{req.sender?.email || req.user_id}</div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => respondToRequest(req.user_id, true)}
                        >
                            Accept
                        </button>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => respondToRequest(req.user_id, false)}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}