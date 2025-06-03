import FormInput from "@/components/auth/forms/FormInput";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import AddressList from "@/components/auth/addresses/AddressList";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import {saveAddress} from "@/app/(user)/addresses/actions";
import SaveButton from "@/components/shop/products/SaveButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export const metadata = {
    title: "AddressPage",
    description: "Page for AddressPage",
};

export default async function AddressPage() {
    const supabase = await createSupabaseServerClient();
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id;

    const {data: addresses, error} = await supabase
        .from('addresses')
        .select('*')
        .eq("user_id", userId);

    return (
        <div className="container mx-auto px-4 pt-32">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-4 text-primary">Your Saved Addresses</h1>
                    <p className="text-base-content/75 mb-6">
                        Manage your delivery locations below. Add, update, or remove addresses as needed.
                    </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <ModalOpenButton className={"btn-primary btn-outline"} id="addAddressesForm"
                                     buttonName={<><FontAwesomeIcon icon={faPlus}/>Add New Address</>}/>
                </div>
            </div>

            <AddressList addresses={addresses}/>


            {/* Modal */}
            <dialog id="addAddressesForm" className="modal">
                <div className="modal-box rounded-xl max-w-md w-full">
                    <form method="dialog">
                        <button
                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3"
                            aria-label="Close">
                            ✕
                        </button>
                    </form>

                    <h3 className="font-semibold text-xl text-primary mb-4">Add New Address</h3>

                    <form
                        id="add-address-form"
                        action={saveAddress}
                        className="space-y-4"
                    >
                        <FormInput
                            label="Country"
                            name="country"
                            type="text"
                            placeholder="e.g., United States"
                        />
                        <FormInput
                            label="City"
                            name="city"
                            type="text"
                            placeholder="e.g., New York"
                        />
                        <FormInput
                            label="Address"
                            name="address"
                            type="text"
                            placeholder="e.g., 23 Avenue Street"
                        />

                        <div className="pt-4">
                            <SaveButton
                                formId="add-address-form"
                                modalId="addAddressesForm"
                                label="Save Address"
                            />
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
}