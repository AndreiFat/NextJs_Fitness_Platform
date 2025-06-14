import Link from "next/link";

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} - Administrator`,
    description: "Panou de control pentru administratori",
};

export default function Admin() {
    return (
        <div className="container mx-auto px-4 py-16 pt-32">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-primary mb-2">Panou Administrator</h1>
                <p className="text-base text-base-content/70 max-w-xl mx-auto">
                    Bine ai venit în centrul de control. Gestionează produsele, categoriile și comenzile clienților
                    într-un singur loc.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
                <Link
                    href="/admin/products"
                    className="card bg-gradient-to-br from-primary/20 to-primary/5 border border-primary shadow-md rounded-xl p-6 h-32 flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-lg"
                >
                    <h2 className="text-xl font-bold text-primary">🛍️ Produse</h2>
                    <p className="text-sm text-base-content text-center">Adaugă, editează sau șterge produsele din
                        magazin.</p>
                </Link>

                <Link
                    href="/admin/categories"
                    className="card bg-gradient-to-br from-primary/20 to-primary/5 border border-primary shadow-md rounded-xl p-6 h-32 flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-lg"
                >
                    <h2 className="text-xl font-bold text-primary">📁 Categorii</h2>
                    <p className="text-sm text-base-content text-center">Organizează produsele în categorii
                        relevante.</p>
                </Link>

                <Link
                    href="/admin/orders"
                    className="card bg-gradient-to-br from-primary/20 to-primary/5 border border-primary shadow-md rounded-xl p-6 h-32 flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-lg"
                >
                    <h2 className="text-xl font-bold text-primary">📦 Comenzi</h2>
                    <p className="text-sm text-base-content text-center">Vizualizează și gestionează comenzile
                        clienților.</p>
                </Link>
            </div>
        </div>
    );
}