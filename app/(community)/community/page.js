import {createSupabaseServerClient} from "@/utils/supabase/server";
import DirectMessages from "@/components/community/DirectMessages";

export const metadata = {
    title: "Community",
    description: "Page for Community",
};

export default async function FriendsPage() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return <p>Please login</p>;

    return (
        <div className="pt-[76px]">
            {/*<AddFriend currentUser={user}/>*/}
            <DirectMessages user={user}/>
        </div>
    );
}