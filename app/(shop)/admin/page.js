import Link from "next/link";

export const metadata = {
    title: "Admin",
    description: "Page for Admin",
};

export default function Admin() {
    return (
        <div className="container mx-auto px-4 py-16 pt-32">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-primary mb-2">Admin Dashboard</h1>
                <p className="text-base text-muted-foreground">
                    Welcome to the control center. Manage your products, categories, and customer orders all in one
                    place.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Link href="/admin/products"
                      className="btn btn-soft h-32 text-left p-6 shadow-md rounded-xl flex flex-col justify-between hover:bg-primary hover:text-white hover:scale-105 transition-transform">
                    <h2 className="text-xl font-bold">🛍️ Products</h2>
                    <p className="text-sm text-base-content text-center">Add, edit, or remove store products.</p>
                </Link>

                <Link href="/admin/categories"
                      className="btn btn-soft h-32 text-left p-6 shadow-md rounded-xl flex flex-col justify-between hover:bg-primary hover:text-white hover:scale-105 transition-transform">
                    <h2 className="text-xl font-bold">📁 Categories</h2>
                    <p className="text-sm text-base-content text-center">Organize products into relevant
                        categories.</p>
                </Link>

                <Link href="/admin/orders"
                      className="btn btn-soft h-32 text-left p-6 shadow-md rounded-xl flex flex-col justify-between hover:bg-primary hover:text-white hover:scale-105 transition-transform">
                    <h2 className="text-xl font-bold">📦 Orders</h2>
                    <p className="text-sm text-base-content text-center">View and manage customer orders.</p>
                </Link>
            </div>
        </div>
    );
}
