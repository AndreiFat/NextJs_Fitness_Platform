import {createSupabaseServerClient} from '@/utils/supabase/server';
import Link from "next/link";
import SaveToFavoritesButton from "@/components/shop/buttons/SaveToFavoritesButton";
import AddToCartButton from "@/components/shop/buttons/AddToCartButton";

export default async function FavoriteList({userId}) {
    const supabase = await createSupabaseServerClient();

    // Fetch all favorite product IDs
    const {data: favorites, error} = await supabase
        .from('favorites')
        .select('product_id, products(name)')
        .eq('user_id', userId);
    console.log(favorites);
    if (error) return <p>Error loading favorites</p>;

    const favoriteIds = favorites ? favorites.map((fav) => fav.product_id) : [];
    console.log("aici sunt id-urile produselor favorite", favoriteIds);
    return (
        <div>
            <ul>
                {favorites.length > 0 ? (
                    favorites.map((product) =>
                        <li key={product.product_id}>
                            Product ID: {product.product_id} | {product.products.name}
                            <Link className={"btn"}
                                  href={`/shop/product/${product.id}`}>View
                                Product</Link>
                            <SaveToFavoritesButton userId={userId} productId={product.product_id}
                                                   initialFavorite={favoriteIds.includes(product.product_id)}/>
                            <AddToCartButton/></li>)
                ) : (
                    <p>No favorites yet.</p>
                )}
            </ul>
        </div>
    );
}