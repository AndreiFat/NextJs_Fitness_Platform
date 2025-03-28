'use client'

import {useEffect, useState} from "react";
import {createSupabaseClient} from "@/utils/supabase/client";

function ProductList({initialProducts}) {
    const [products, setProducts] = useState(initialProducts);

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
                {products.map((product) => (<li key={product.id} className="border p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-500">{product.description}</p>
                </li>))}
            </ul>
        </div>
    );
}

export default ProductList;