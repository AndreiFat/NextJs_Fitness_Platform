import Link from "next/link";

export const metadata = {
    title: "Admin",
    description: "Page for Admin",
};

export default function Admin() {
    return (
        <div>
            <h1>Admin</h1>
            <p>This is the Admin page.</p>
            <Link href={"/admin/products"}>Products</Link>
            <Link href={"/admin/categories"}>Categories</Link>
        </div>
    );
}
