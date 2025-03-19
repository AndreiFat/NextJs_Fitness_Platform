import {createSupabaseServerClient} from "@/utils/supabase/server";

export const metadata = {
    title: "Fitness",
    description: "Page for Fitness",
};

export default async function Fitness() {
    const supabase = await createSupabaseServerClient()

    const {
        data: {user},
    } = await supabase.auth.getUser()
    return (
        <div>
            <h1>Fitness</h1>
            <p>This is the Fitness page.</p>
            {user ? <pre>This is the user {JSON.stringify(user.email)}</pre> : "Nu esti autentificat"}
        </div>
    );
}
