import {createSupabaseServerClient} from "@/utils/supabase/server";
import CategoryList from "@/components/shop/categories/CategoryList";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import FormInput from "@/components/auth/forms/FormInput";
import SaveButton from "@/components/shop/products/SaveButton";
import {saveCategory} from "@/app/(shop)/admin/actions";

export const metadata = {
    title: "CategoryPage",
    description: "Page for CategoryPage",
};

export default async function CategoryPage() {
    const supabase = await createSupabaseServerClient();

    const {data: categories, error} = await supabase
        .from('categories')
        .select('*')

    return (
        <div>
            <h1>CategoryPage</h1>

            <CategoryList categories={categories}></CategoryList>

            <div className="flex gap-2">
                <ModalOpenButton id={"addCategoryForm"} buttonName={"Add new category"}></ModalOpenButton>
                <dialog id={"addCategoryForm"} className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button
                                className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                            </button>
                        </form>
                        <h3 className="font-bold text-lg">Add new category: </h3>
                        <form id="add-category-form" action={saveCategory}
                              className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-2">
                            <FormInput label="Name: " name="name" type="text" placeholder="Category name"/>

                            <SaveButton formId="add-category-form" modalId="addCategoryForm" label="Save Category"/>
                        </form>
                    </div>
                </dialog>
            </div>
        </div>
    );
}