'use client'

import {useEffect, useState} from "react";
import {createSupabaseClient} from "@/utils/supabase/client";
import Link from "next/link";
import SaveToFavoritesButton from "@/components/shop/buttons/SaveToFavoritesButton";
import AddToCartButton from "@/components/shop/buttons/AddToCartButton";

function ProductList({initialProducts, userId, initialFavoriteIds, initialCartItems}) {
    const [products, setProducts] = useState(initialProducts);
    const [favoriteIds, setFavoritesIds] = useState(initialFavoriteIds);
    const [cartItems, setCartItems] = useState(initialCartItems);
    console.log("cartItems", initialCartItems);
    useEffect(() => {
        const supabase = createSupabaseClient();

        async function fetchProducts() {
            let {data, error} = await supabase.from('products').select('*');
            if (!error) setProducts(data);
        }

        fetchProducts(); // Fetch inițial

        // Configurare real-time updates
        const channel = supabase
            .channel('realtime:products')
            .on('postgres_changes', {event: '*', schema: 'public', table: 'products'}, (payload) => {
                console.log('Modificare detectată:', payload);
                fetchProducts(); // Actualizare produse când se modifică tabela
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel); // Cleanup la demontare componentă
        };
    }, []);

    return (
        <div>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {products.map((product) => (
                    <li key={product.id} className="border p-4 rounded-md shadow-sm">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-500">{product.description}</p>
                        <div className="flex gap-2">
                            <Link className={"btn"} href={`/shop/product/${product.id}`}>View Product</Link>
                            <SaveToFavoritesButton userId={userId} productId={product.id}
                                                   initialFavorite={favoriteIds.includes(product.id)}/>
                            <AddToCartButton userId={userId} productId={product.id}
                                             initialQuantity={cartItems[product.id] || 0}/>
                        </div>
                    </li>))}
            </ul>
        </div>
    );
}

export default ProductList;