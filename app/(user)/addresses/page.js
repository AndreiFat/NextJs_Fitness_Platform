import FormInput from "@/components/auth/forms/FormInput";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import AddressList from "@/components/auth/addresses/AddressList";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import {saveAddress} from "@/app/(user)/addresses/actions";

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
        <div>
            <AddressList addresses={addresses}></AddressList>

            <div className="flex gap-2">
                <ModalOpenButton id={"addAddressesForm"} buttonName={"Add new address"}></ModalOpenButton>
                <dialog id={"addAddressesForm"} className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button
                                className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                            </button>
                        </form>
                        <h3 className="font-bold text-lg">Add new address: </h3>
                        <form method={"dialog"}
                              className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-2">
                            <FormInput label="Country: " name="country" type="text" placeholder="United States"/>
                            <FormInput label="Your city: " name="city" type="text" placeholder="New York"/>
                            <FormInput label="Your address: " name="address" type="text"
                                       placeholder="Avenue Street, 23"/>

                            <button
                                type="submit"
                                formAction={saveAddress}
                                className="w-50 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Save Address
                            </button>
                        </form>
                    </div>
                </dialog>
            </div>
        </div>
    );
}