'use client';

import {createSupabaseClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {FriendRequests} from "@/components/community/FriendRequest";
import {AddFriend} from "@/components/community/AddFriend";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faUserPlus, faUsers} from "@fortawesome/free-solid-svg-icons";

export default function DirectMessages({user}) {
    const supabase = createSupabaseClient();
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const [requestCount, setRequestCount] = useState(0);

    const activeFriend = friends.find((f) => f.friend_id === selectedFriend);

    // Fetch friends
    useEffect(() => {
        const fetchFriends = async () => {
            const {data, error} = await supabase
                .from("friends")
                .select(`
          id,
          user_id,
          friend_id,
          sender: user_id (email, full_name),
          receiver: friend_id (email, full_name)
        `)
                .eq("status", "accepted")
                .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

            if (!error) {
                const cleaned = data.map((f) => {
                    const isSender = f.user_id === user.id;
                    const friendId = isSender ? f.friend_id : f.user_id;
                    const friendData = isSender ? f.receiver : f.sender;

                    return {
                        friend_id: friendId,
                        email: friendData?.email,
                        full_name: friendData?.full_name,
                    };
                });

                const uniqueMap = new Map();
                cleaned.forEach((f) => {
                    if (!uniqueMap.has(f.friend_id)) {
                        uniqueMap.set(f.friend_id, f);
                    }
                });

                setFriends(Array.from(uniqueMap.values()));
            }
        };

        fetchFriends();

        const channel = supabase
            .channel("realtime:friends")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "friends",
                },
                (payload) => {
                    const newStatus = payload.new.status;
                    const {user_id, friend_id} = payload.new;

                    if (
                        newStatus === "accepted" &&
                        (user_id === user.id || friend_id === user.id)
                    ) {
                        fetchFriends();
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [user.id]);

    // Fetch messages
    useEffect(() => {
        if (!selectedFriend) return;

        const fetchMessages = async () => {
            const {data, error} = await supabase
                .from("messages")
                .select("*")
                .or(
                    `and(sender_id.eq.${user.id},receiver_id.eq.${selectedFriend}),and(sender_id.eq.${selectedFriend},receiver_id.eq.${user.id})`
                )
                .order("created_at", {ascending: true});

            if (!error) setMessages(data);
        };

        fetchMessages();

        const channel = supabase
            .channel("realtime:messages")
            .on(
                "postgres_changes",
                {event: "INSERT", schema: "public", table: "messages"},
                (payload) => {
                    const msg = payload.new;
                    if (
                        (msg.sender_id === user.id && msg.receiver_id === selectedFriend) ||
                        (msg.receiver_id === user.id && msg.sender_id === selectedFriend)
                    ) {
                        setMessages((prev) => [...prev, msg]);
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [selectedFriend, user.id]);

    const sendMessage = async () => {
        if (!input.trim() || !selectedFriend) return;
        await supabase.from("messages").insert({
            sender_id: user.id,
            receiver_id: selectedFriend,
            text: input,
        });
        setInput("");
    };

    useEffect(() => {
        const fetchRequests = async () => {
            const {data, count} = await supabase
                .from("friends")
                .select("*, sender: user_id(email)", {count: 'exact'})
                .eq("friend_id", user.id)
                .eq("status", "pending");

            setRequestCount(count || 0);
        };

        fetchRequests();
    }, [user.id]);

    return (
        <div className="flex h-[90vh] overflow-hidden">
            {/* Friends list */}
            <div className="w-1/3 border-r-2 border-base-content/25 p-4 overflow-y-auto flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-4">Lista de prieteni</h2>
                    <ul className="">
                        {friends.map((friend) => (
                            <div key={friend.friend_id}>
                                <li
                                    className={`p-2 rounded cursor-pointer hover:bg-base-200 ${
                                        selectedFriend === friend.friend_id ? "bg-base-200" : ""
                                    }`}
                                    onClick={() => setSelectedFriend(friend.friend_id)}
                                >
                                    {friend.full_name || friend.email || friend.friend_id.slice(0, 8)}
                                </li>
                                <div className="divider m-0"></div>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className={"flex flex-col gap-1"}>
                    <div className="collapse collapse-arrow bg-base-100/75 border border-base-300">
                        <input type="checkbox"/>
                        <div className="collapse-title font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faUsers}/>
                            Cereri de prietenie
                            {requestCount > 0 && (
                                <span className="ml-2 badge badge-sm badge-primary">{requestCount}</span>
                            )}
                        </div>
                        <div className="collapse-content text-sm">
                            <FriendRequests userId={user.id} onCountChange={setRequestCount}/>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-base-100/75 border border-base-300">
                        <input type="checkbox"/>
                        <div className="collapse-title font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faUserPlus}/>
                            Adaugă un nou prieten
                        </div>
                        <div className="collapse-content text-sm">
                            <AddFriend currentUser={user}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat view */}
            <div className="flex-1 flex flex-col bg-base-100/35">
                {/* Chat header */}
                <div
                    className="mt-4 mx-4 mb-0.5 p-4 border-base-content/30 bg-base-100 rounded-xl shadow-lg shadow-base-content/5">
                    <h3 className="text-lg">
                        <div className={"font-semibold text-primary"}>
                            {activeFriend?.full_name || activeFriend?.email || "Selectează un prieten"}
                        </div>
                        <div className={"text-sm font-light text-base-content/75"}>
                            {activeFriend?.email || ""}
                        </div>
                    </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mb-2 flex ${
                                msg.sender_id === user.id ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`px-3 py-2 rounded-lg max-w-xs ${
                                    msg.sender_id === user.id
                                        ? "bg-primary text-white"
                                        : "bg-base-200"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="mx-4 mb-4 mt-0.5 px-4 py-4.5 bg-base-100 flex gap-2 rounded-xl">
                    <input
                        className="input input-bordered flex-1"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Scrie un mesaj..."
                    />
                    <button className="btn btn-primary" onClick={sendMessage}>
                        Trimite <FontAwesomeIcon icon={faPaperPlane} size="lg"/>
                    </button>
                </div>
            </div>
        </div>
    );
}
