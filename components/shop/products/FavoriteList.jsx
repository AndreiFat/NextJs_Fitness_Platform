import SaveToFavoritesButton from "@/components/shop/buttons/SaveToFavoritesButton";
import Product from "@/components/shop/products/Product";
import AddToCartButton from "@/components/shop/buttons/AddToCartButton";
import {getCart} from "@/app/(shop)/shop/actions";

export default async function FavoriteList({favorites, userId}) {

    // Fetch cart data
    const {cart} = await getCart(userId);
    const cartItems = cart.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
    }, {});
    const favoriteIds = favorites ? favorites.map((fav) => fav.product_id) : [];

    return (
        <div>
            {favorites.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                    {favorites.map((product, index) =>
                        <Product key={index}
                                 product={product.products}
                                 addToCartButton={<AddToCartButton isDisabled={product.products.is_active}
                                                                   userId={userId} productId={product.product_id}
                                                                   initialQuantity={cartItems[product.product_id] || 0}/>}
                                 addToFavoriteButton={
                                     <SaveToFavoritesButton userId={userId} isDisabled={true}
                                                            productId={product.product_id}
                                                            initialFavorite={favoriteIds.includes(product.product_id)}/>}/>
                    )}</div>
            ) : (
                <p>No favorites yet.</p>)
            }
        </div>
    );
}