import FavoriteList from "@/components/shop/products/FavoriteList";
import React from "react";

export const metadata = {
    title: "Products",
    description: "Page for Products",
};

export default async function FavoriteProducts({products, userId}) {

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Favorite Products</h1>
            <p className="text-base-content/75 mb-6">
                Easily access all the products you've marked as favorites. They're saved here for quick viewing,
                comparing, or purchasing later.
            </p>
            <FavoriteList favorites={products} userId={userId}/>
        </div>
    );
}
