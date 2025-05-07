import {createSupabaseServerClient} from "@/utils/supabase/server";
import ProductList from "@/components/shop/products/ProductList";
import {getCart} from "@/app/(shop)/shop/actions";


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
    // Fetch all products
    const {data: products, error} = await supabase.from("products").select("*");

    if (error) return <p>Eroare la încărcarea produselor.</p>;

    // Fetch cart data
    const {cart} = await getCart(user.id);
    const cartItems = cart.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
    }, {});

    console.log(cartItems);
    return (
        <div>
            <h1>Shop</h1>
            <ProductList initialProducts={products} userId={user.id} initialFavoriteIds={favoriteIds}
                         initialCartItems={cartItems}></ProductList>
        </div>
    );
}