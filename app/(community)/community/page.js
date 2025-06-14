import {createSupabaseServerClient} from "@/utils/supabase/server";
import DirectMessages from "@/components/community/DirectMessages";
import {redirect} from "next/navigation";

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} - Comunitate`,
    description: "Conectează-te cu alți utilizatori, împărtășește progresul tău și învață din experiențele altora.",
};

export default async function FriendsPage() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    return (
        <div className="pt-[76px]">
            {/*<AddFriend currentUser={user}/>*/}
            <DirectMessages user={user}/>
        </div>
    );
}