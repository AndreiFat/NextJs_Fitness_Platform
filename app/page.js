import Homepage from "@/app/(homepage)/Homepage";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export default async function Home() {
    const supabase = await createSupabaseServerClient();
    const user = await supabase.auth.getUser();
    console.log(user.data.user);
    return (
        <div>
            <Homepage/>
        </div>
    )
}
