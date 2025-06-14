import {createSupabaseServerClient} from "@/utils/supabase/server";
import CategoryList from "@/components/shop/categories/CategoryList";
import FormInput from "@/components/auth/forms/FormInput";
import SaveButton from "@/components/shop/products/SaveButton";
import {saveCategory} from "@/app/(shop)/admin/actions";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export const metadata = {
    title: "CategoryPage",
    description: "Page for CategoryPage",
};

export default async function CategoryPage() {
    const supabase = await createSupabaseServerClient();

    const {data: categories, error} = await supabase
        .from('categories')
        .select('*').order('id', {ascending: true})

    return (
        <div className={"container py-32 mx-auto"}>
            <div className="flex justify-between mb-6 items-center">
                <div><span
                    className="uppercase font-bold mb-2 badge badge-soft text-sm badge-lg">Admin Panel</span>
                    <h1 className="text-3xl font-bold mb-2 text-primary">Administrare categorii</h1>
                </div>
                <div>
                    <ModalOpenButton className={"btn-outline btn-primary"} id={"addCategoryForm"}
                                     buttonName={<><FontAwesomeIcon icon={faPlus}/>Adauga o
                                         categorie</>}></ModalOpenButton>
                    <dialog id={"addCategoryForm"} className="modal w-full">
                        <div className="modal-box max-w-lg w-full mx-auto relative overflow-hidden">
                            <form method="dialog">
                                <button
                                    className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                </button>
                            </form>
                            <h3 className="font-bold text-lg">Adauga o noua categorie</h3>
                            <form id="add-category-form" action={saveCategory}
                                  className="mt-4">
                                <FormInput label="Nume" name="name" type="text" placeholder="Numele categoriei"/>
                                <SaveButton formId="add-category-form" modalId="addCategoryForm" label="Save Category"/>
                            </form>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
            </div>
            <CategoryList categories={categories}></CategoryList>

        </div>
    );
}