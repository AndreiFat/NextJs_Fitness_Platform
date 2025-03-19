import {createSupabaseServerClient} from "@/utils/supabase/server";
import Link from "next/link";
import Test from "@/app/(homepage)/components/Test";

export default async function Home() {
    const supabase = await createSupabaseServerClient()

    const {
        data: {user},
    } = await supabase.auth.getUser()

    return (
        <div>
            {user ? (<>Authenicated user: {user.email}
                <div>
                    <form action="/api/auth/logout" method="post">
                        <button className="button block" type="submit">
                            Sign out
                        </button>
                    </form>
                </div>
            </>) : <>User: {JSON.stringify(user)}
                <div>
                    <Link href={"/login"}>Login</Link>
                    <Test user={user}></Test>
                </div>
            </>}
        </div>
    )
}
