import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import {saveProduct} from "@/app/(shop)/admin/actions";
import FormInput from "@/components/auth/forms/FormInput";
import ProductTable from "@/components/shop/products/ProductTable";

export const metadata = {
    title: "AdminProducts",
    description: "Page for AdminProducts",
};

export default function AdminProducts() {
    return (
        <div>
            <p>All the products from database: </p>
            <ProductTable></ProductTable>

            <ModalOpenButton buttonName={"Add product"} id="addProductModal"></ModalOpenButton>

            <dialog id={"addProductModal"} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button
                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Add new product: </h3>
                    <form method={"dialog"}
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

                        <button
                            type="submit"
                            formAction={saveProduct}
                            className="w-50 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Save Address
                        </button>
                    </form>
                </div>
            </dialog>


        </div>
    );
}