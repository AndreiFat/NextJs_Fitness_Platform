import {createSupabaseServerClient} from "@/utils/supabase/server";
import ProductList from "@/components/shop/products/ProductList";
import {getCart} from "@/app/(shop)/shop/actions";
import SortButtons from "@/components/shop/buttons/SortButtons";
import CategoryFilterDropdown from "@/components/shop/buttons/CategoryFilterDropdown";
import PaginationControls from "@/components/shop/buttons/PaginationControls";
import PaginationDropdown from "@/components/shop/buttons/PaginationDropdown";

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
        .order(sortKeyByFilter, {ascending: sortAscOrDesc === 'asc'})
        .range(from, to)

    if (sortByCategory) {
        query = query.eq('category_id', sortByCategory);
    }

    const {data: products, count, error} = await query;

    const {data: categories} = await supabase
        .from('categories')
        .select('id, name');

    if (error) return <p>Eroare la încărcarea produselor.</p>;

    const {cart} = await getCart(user.id);
    const cartItems = cart.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
    }, {});

    const totalPages = Math.ceil((count || 0) / limitSort);

    return (
        <div>
            <h1>Shop</h1>
            <SortButtons sortKey="name"/>
            <SortButtons sortKey="price" labelAsc="1 → 2" labelDesc="2 → 1"/>
            <CategoryFilterDropdown categories={categories}/>
            <PaginationDropdown options={[10, 15, 30]} paramName={"limit"}></PaginationDropdown>
            <ProductList initialProducts={products} userId={user.id} initialFavoriteIds={favoriteIds}
                         initialCartItems={cartItems}></ProductList>
            <PaginationControls totalPages={totalPages}></PaginationControls>
        </div>
    );
}