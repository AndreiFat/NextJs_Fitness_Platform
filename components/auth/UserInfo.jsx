"use client";
import {useEffect, useState} from "react";
import {createSupabaseClient} from "@/utils/supabase/client";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

export default function UserInfo({userInfo}) {
    const [user, setUser] = useState(userInfo);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = await createSupabaseClient();
            const {data, error} = await supabase.auth.getUser();
            if (data?.user) setUser(data.user || userInfo);
        };
        fetchUser();

        const fetchUserAdmin = async () => {
            const supabase = await createSupabaseClient();
            const {data: users, error} = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            if (users?.is_admin) setIsAdmin(true);
        }
        fetchUserAdmin();
    }, []);


    return <>
        {user ? (<div>
            <div className="dropdown focus:outline-accent">
                <div tabIndex={0} className="btn btn-ghost bg-neutral-100/10 rounded-xl h-auto p-1 m-1">
                    <div className="avatar">
                        <div className="w-10 h-10 rounded-xl">
                            {user.user_metadata.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="avatar"/>) : (
                                <div
                                    className="bg-accent/80 w-full h-full text-white flex justify-center items-center">
                                    <FontAwesomeIcon icon={faUser} size="xl"/>
                                </div>)}

                        </div>
                    </div>
                    <div className="text-left pr-2 pl-1">
                        <p className={"mb-0"}>{user.user_metadata.full_name}</p>
                        <p className={"mb-0 font-light text-neutral-400"}>{user.user_metadata.email}</p>
                    </div>
                </div>
                <ul tabIndex={0}
                    className="menu dropdown-content bg-base-100 rounded-box z-1 w-full p-2 shadow-sm spacer-y-2">
                    <li><Link href={"/account-settings"}>Account</Link></li>
                    <li><Link href={"/orders"}>Orders</Link></li>
                    <li><Link href={"/addresses"}>Addresses</Link></li>
                    {isAdmin ? (<li><Link href={"/admin/products"}>Products</Link></li>) : ""}
                    <li className={""}><LogoutButton/></li>
                </ul>
            </div>
        </div>) : ""}
    </>;
}