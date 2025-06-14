'use client'

import {useEffect, useState} from "react";
import {createSupabaseClient} from "@/utils/supabase/client";
import SaveToFavoritesButton from "@/components/shop/buttons/SaveToFavoritesButton";
import AddToCartButton from "@/components/shop/buttons/AddToCartButton";
import {useSearchParams} from "next/navigation";
import Product from "@/components/shop/products/Product";

function ProductList({initialProducts, userId, initialFavoriteIds, initialCartItems}) {
    const [products, setProducts] = useState(initialProducts);
    const [favoriteIds, setFavoritesIds] = useState(initialFavoriteIds);
    const [cartItems, setCartItems] = useState(initialCartItems);

    const searchParams = useSearchParams();

    const sortAscOrDesc = searchParams.get("sort") === 'desc' ? 'desc' : 'asc';
    const sortKeyByFilter = searchParams.get("sortKey") || 'name';
    const sortByCategory = searchParams.get("category");

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const pageSort = parseInt(page || '1');
    const limitSort = parseInt(limit || '10');
    const from = (pageSort - 1) * limitSort;
    const to = from + limitSort - 1;

    useEffect(() => {
        const supabase = createSupabaseClient();

        async function fetchProducts() {
            let query = supabase
                .from('products')
                .select('*, category: categories(name)', {count: 'exact'})
                .eq('is_active', "TRUE")
                .order(sortKeyByFilter, {ascending: sortAscOrDesc === 'asc'})
                .range(from, to)

            if (sortByCategory) {
                query = query.eq('category_id', sortByCategory);
            }

            const {data: updateProducts, count, error} = await query;

            if (!error) {
                setProducts(updateProducts)
            }
            const totalPages = Math.ceil((count || 0) / limitSort);
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
    }, [sortAscOrDesc, sortKeyByFilter, sortByCategory, page, limit]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4">
                {products.map((product, index) => (
                    <Product key={index}
                             product={product}
                             addToCartButton={<AddToCartButton isDisabled={product.is_active}
                                                               userId={userId} productId={product.id}
                                                               initialQuantity={cartItems[product.id] || 0}/>}
                             addToFavoriteButton={
                                 <SaveToFavoritesButton userId={userId} isDisabled={product.is_active}
                                                        productId={product.id}
                                                        initialFavorite={favoriteIds.includes(product.id)}/>}/>
                ))}
            </div>
        </div>
    );
}

export default ProductList;