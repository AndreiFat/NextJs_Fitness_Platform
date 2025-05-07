import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import FormInput from "@/components/auth/forms/FormInput";
import ProductTable from "@/components/shop/products/ProductTable";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import SaveButton from "@/components/shop/products/SaveButton";
import {saveProduct} from "@/app/(shop)/admin/actions";

export const metadata = {
    title: "AdminProducts",
    description: "Page for AdminProducts",
};

export default async function AdminProducts() {
    const supabase = await createSupabaseServerClient();
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id;

    const {data: products, error} = await supabase
        .from('products')
        .select('*')

    return (
        <div>
            <ModalOpenButton buttonName={"Add product"} id="addProductModal"></ModalOpenButton>

            <p>All the products from database: </p>
            <ProductTable products={products}></ProductTable>

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