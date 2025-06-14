import FavoriteList from "@/components/shop/products/FavoriteList";
import React from "react";

export default async function FavoriteProducts({products, userId}) {

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Produse Favorite</h1>
            <p className="text-base-content/75 mb-6">
                Accesează rapid toate produsele pe care le-ai marcat ca favorite. Sunt salvate aici pentru vizualizare
                rapidă,
                comparare sau achiziție ulterioară.
            </p>
            <FavoriteList favorites={products} userId={userId}/>
        </div>
    );
}
