import FavoriteList from "@/components/shop/products/FavoriteList";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export const metadata = {
    title: "Products",
    description: "Page for Products",
};

export default async function FavoriteProducts() {
    const supabase = await createSupabaseServerClient()
    const {data: {user}, error} = await supabase.auth.getUser()

    return (
        <div>
            <h1>Products</h1>
            <p>This is the Favorite Products page.</p>
            <FavoriteList userId={user.id}/>
        </div>
    );
}
