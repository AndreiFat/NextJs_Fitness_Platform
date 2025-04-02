import {createSupabaseServerClient} from "@/utils/supabase/server";
import ProductList from "@/components/shop/products/ProductList";


export const metadata = {
    title: "Shop",
    description: "Page for Shop",
};

export default async function Shop() {
    const supabase = await createSupabaseServerClient();

    // Fetch authenticated user
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return <p>Please log in</p>;

    const {data: favorites} = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", user.id);

    const favoriteIds = favorites ? favorites.map((fav) => fav.product_id) : [];
    console.log(favoriteIds);
    // Fetch all products
    const {data: products, error} = await supabase.from("products").select("*");

    if (error) return <p>Eroare la încărcarea produselor.</p>;

    return (
        <div>
            <h1>Shop</h1>
            <ProductList initialProducts={products} userId={user.id} initialFavoriteIds={favoriteIds}></ProductList>
        </div>
    );
}