import {createSupabaseServerClient} from "@/utils/supabase/server";
import ProductList from "@/components/shop/products/ProductList";
import {getCart} from "@/app/(shop)/shop/actions";
import SortButtons from "@/components/shop/buttons/SortButtons";
import CategoryFilterDropdown from "@/components/shop/buttons/CategoryFilterDropdown";
import PaginationControls from "@/components/shop/buttons/PaginationControls";
import PaginationDropdown from "@/components/shop/buttons/PaginationDropdown";
import PromotionSlider from "@/components/shop/products/PromotionSlider";

export const metadata = {
    title: "Shop",
    description: "Page for Shop",
};

export default async function Shop({searchParams}) {
    const supabase = await createSupabaseServerClient();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return <p>Please log in</p>;

    const {sort} = await searchParams;
    const {sortKey} = await searchParams;
    const {category} = await searchParams;

    const {page} = await searchParams;
    const {limit} = await searchParams;

    const sortAscOrDesc = sort === 'desc' ? 'desc' : 'asc';
    const sortKeyByFilter = sortKey || 'name';
    const sortByCategory = category || '';

    const pageSort = parseInt(page || '1');
    const limitSort = parseInt(limit || '10');
    const from = (pageSort - 1) * limitSort;
    const to = from + limitSort - 1;

    const {data: favorites} = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", user.id);

    const favoriteIds = favorites ? favorites.map((fav) => fav.product_id) : [];

    let query = supabase
        .from('products')
        .select('*, category: categories(name)', {count: 'exact'})
        .eq('is_active', "TRUE")
        .order(sortKeyByFilter, {ascending: sortAscOrDesc === 'asc'})
        .range(from, to)

    if (sortByCategory) {
        query = query.eq('category_id', sortByCategory);
    }

    const {data: products, count, error} = await query;

    const {data: categories} = await supabase
        .from('categories')
        .select('id, name');

    if (error) {
        console.log(error)
        return <div className={"p-32"}><p>Eroare la încărcarea produselor.</p></div>
    }

    const {cart} = await getCart(user.id);
    const cartItems = cart.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
    }, {});

    const totalPages = Math.ceil((count || 0) / limitSort);

    const promotions = [
        {
            title: "🔥 20% REDUCERE la toate suplimentele proteice",
            description: "Ofertă limitată! Hrănește-ți progresul în mod inteligent.",
            image: "/assets/banners/banner1.jpg"
        },
        {
            title: "🧘 Covorașe de yoga noi în stoc",
            description: "Covorașe premium, eco-friendly, cu livrare gratuită.",
            image: "/assets/banners/banner2.jpg"
        },
        {
            title: "🏃 Livrare gratuită la comenzi peste 250 RON",
            description: "Doar săptămâna aceasta. Nu rata ocazia!",
            image: "/assets/banners/banner3.jpg"
        }
    ];

    return (
        <div className="container mx-auto py-32 md:px-6 lg:px-0 px-4">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-2">
                    Bine ai venit în FitMarket 🏋️‍♀️
                </h1>
                <p className="text-base text-muted-foreground max-w-3xl mx-auto">
                    Descoperă tot ce ai nevoie pentru a-ți duce călătoria fitness la următorul nivel — de la echipamente
                    și suplimente de calitate, până la planuri personalizate.
                    Folosește filtrele de mai jos pentru a găsi produsele perfecte pentru tine.
                </p>
            </header>
            <PromotionSlider promotions={promotions}/>
            <div className="card bg-base-100 my-4">
                <div className="card-body">
                    <h2 className={"text-2xl font-bold mb-2 text-primary"}>Filtre</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-between gap-4 lg:gap-6">
                        <SortButtons sortKey="name"/>
                        <SortButtons sortKey="price" labelAsc="Preț crescător" labelDesc="Preț descrescător"/>
                        <CategoryFilterDropdown categories={categories}/>
                        <PaginationDropdown options={[10, 15, 30]} paramName={"limit"}></PaginationDropdown>
                    </div>
                </div>
            </div>
            <ProductList initialProducts={products} userId={user.id} initialFavoriteIds={favoriteIds}
                         initialCartItems={cartItems}></ProductList>
            <PaginationControls totalPages={totalPages}></PaginationControls>
        </div>
    );
}