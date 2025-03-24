import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import ProductList from "@/components/ProductList";

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
            <Link href={"/"}>Homepage</Link>
            <h1>Shop</h1>
            <p>This is the Shop page.</p>

            {/* Fetch user info on the client side */}
            <UserInfo/>
            <ProductList initialProducts={products}/>
        </div>
    );
}