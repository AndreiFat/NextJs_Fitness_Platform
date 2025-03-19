import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import {createSupabaseServerClient} from "@/utils/supabase/server";

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

            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {products.map((product) => (
                    <li key={product.id} className="border p-4 rounded-md shadow-sm">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}