import Link from "next/link";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import ProductList from "@/components/shop/products/ProductList";

export const metadata = {
    title: "Shop",
    description: "Page for Shop",
};

export default async function Shop() {
    const supabase = await createSupabaseServerClient();
    // Fetch products from the database (server-side)
    const {data: products, error} = await supabase.from("products").select("*");
    if (error) return <p>Eroare la încărcarea produselor.</p>;
    return (
        <div>
            <Link href={"/public"}>Homepage</Link>
            <h1>Shop</h1>
            <p>This is the Shop page.</p>

            <ProductList initialProducts={products}/>
        </div>
    );
}