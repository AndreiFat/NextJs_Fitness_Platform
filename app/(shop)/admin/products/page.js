import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import FormInput from "@/components/auth/forms/FormInput";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import SaveButton from "@/components/shop/products/SaveButton";
import {saveProduct} from "@/app/(shop)/admin/actions";
import SortButtons from "@/components/shop/buttons/SortButtons";
import CategoryFilterDropdown from "@/components/shop/buttons/CategoryFilterDropdown";
import ProductTable from "@/components/shop/products/ProductTable";
import PaginationDropdown from "@/components/shop/buttons/PaginationDropdown";
import PaginationControls from "@/components/shop/buttons/PaginationControls";
import InputLabel from "@/components/forms/InputLabel";

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} — Admin / Produse`,
    description: "Page for AdminProducts",
};

export default async function AdminProducts({searchParams}) {
    const supabase = await createSupabaseServerClient();
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id;

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

    // const {data: products, error} = await supabase
    //     .from('products')
    //     .select('*, category: categories(name)')
    //     .order(sortKeyByFilter, {ascending: sortAscOrDesc === 'asc'});

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

    const totalPages = Math.ceil((count || 0) / limitSort);

    return (
        <div className="py-32 container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                <span
                    className="uppercase font-bold mb-2 badge badge-soft text-sm badge-lg">Admin Panel</span>
                    <h1 className="text-3xl font-bold mb-2 text-primary">Administrare produse</h1>
                    <p className="text-sm text-base-content/70">
                        Vizualizează, editează și adaugă produse în magazinul tău.
                    </p>
                </div>
                <ModalOpenButton buttonName={"Adauga un produs nou"} className={"btn-primary"}
                                 id="addProductModal"></ModalOpenButton>
            </div>
            <div className="card bg-base-100 my-4">
                <div className="card-body">
                    <h2 className={"text-2xl font-bold mb-2 text-primary"}>Filters</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-between gap-4 lg:gap-6">
                        <SortButtons sortKey="name"/>
                        <SortButtons sortKey="price" labelAsc="1 → 2" labelDesc="2 → 1"/>
                        <CategoryFilterDropdown categories={categories}/>
                        <PaginationDropdown options={[10, 15, 30]} paramName={"limit"}></PaginationDropdown>
                    </div>
                </div>
            </div>

            <ProductTable products={products}></ProductTable>
            <PaginationControls totalPages={totalPages}></PaginationControls>

            <dialog id={"addProductModal"} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button
                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Adauga un produs nou</h3>
                    <form id="add-product-form" action={saveProduct}
                          className="mt-4">
                        <FormInput type="text" placeholder="ex: L-Carnitine" label="Numele produsului"
                                   name="name"></FormInput>
                        <FormInput type="text" placeholder="ex: Composition and so on" label="Descriere"
                                   name="description"></FormInput>
                        <div className="flex gap-4 w-full">
                            <FormInput type="number" placeholder="100$" label="Product price" name="price"></FormInput>
                            <FormInput type="number" placeholder="100" label="Product stock" name="stock"></FormInput>
                        </div>
                        <label className="form-control w-full">
                            <InputLabel label={"Selecteaza o categorie"}></InputLabel>
                            <select name="category_id" className="select select-bordered w-full" required
                                    defaultValue="">
                                <option disabled value="">Alege o categorie</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </label>
                        <fieldset className="fieldset mt-3">
                            <InputLabel label={"Alege o imagine"}></InputLabel>
                            <input type="file" className="file-input w-full" multiple accept="image/*" name="images"/>
                            <label className="fieldset-label">Dimensiune maxima 2MB</label>
                        </fieldset>
                        <SaveButton formId="add-product-form" modalId="addProductModal" label="Salveaza produsul"/>
                    </form>
                </div>
            </dialog>
        </div>
    );
}