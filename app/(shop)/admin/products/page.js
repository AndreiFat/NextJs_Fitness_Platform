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

export const metadata = {
    title: "AdminProducts",
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
        <div>
            <ModalOpenButton buttonName={"Add product"} id="addProductModal"></ModalOpenButton>

            <p>All the products from database: </p>
            <SortButtons sortKey="name"/>
            <SortButtons sortKey="price" labelAsc="1 → 2" labelDesc="2 → 1"/>
            <CategoryFilterDropdown categories={categories}/>
            <PaginationDropdown options={[10, 15, 30]} paramName={"limit"}></PaginationDropdown>
            <ProductTable products={products}></ProductTable>
            <PaginationControls totalPages={totalPages}></PaginationControls>

            <dialog id={"addProductModal"} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button
                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Add new product: </h3>
                    <form id="add-product-form" action={saveProduct}
                          className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-2">
                        <FormInput type="text" placeholder="ex: L-Carnitine" label="Product name: "
                                   name="name"></FormInput>
                        <FormInput type="text" placeholder="ex: Composition and so on" label="Product description: "
                                   name="description"></FormInput>
                        <FormInput type="number" placeholder="100$" label="Product price: " name="price"></FormInput>
                        <FormInput type="number" placeholder="100" label="Product stock: " name="stock"></FormInput>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Select category:</span>
                            </div>
                            <select name="category_id" className="select select-bordered" required defaultValue="">
                                <option disabled value="">Pick a category</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </label>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Pick an image</legend>
                            <input type="file" className="file-input" multiple accept="image/*" name="images"/>
                            <label className="fieldset-label">Max size 2MB</label>
                        </fieldset>
                        <SaveButton formId="add-product-form" modalId="addProductModal" label="Save Product"/>
                    </form>
                </div>
            </dialog>
        </div>
    );
}