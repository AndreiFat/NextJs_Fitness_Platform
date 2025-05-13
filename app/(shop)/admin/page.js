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
            <div className="flex gap-3">
                <Link className={"btn btn-accent"} href={"/admin/products"}>Products</Link>
                <Link className={"btn btn-accent"} href={"/admin/categories"}>Categories</Link>
                <Link className={"btn btn-accent"} href={"/admin/orders"}>Orders</Link>
            </div>
        </div>
    );
}
