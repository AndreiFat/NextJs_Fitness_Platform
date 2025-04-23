'use client'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {deleteAddress, updateAddress} from "@/app/(user)/addresses/actions";
import FormInput from "@/components/auth/forms/FormInput";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";

export default function AddressList({addresses}) {
    return (
        <div>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {addresses.map((address) => (<li key={address.id} className="border p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold">{address.country}</h3>
                    <p className="text-gray-500">{address.city}</p>
                    <p className="text-gray-500">{address.address}</p>
                    <div className="flex gap-2">
                        <ModalOpenButton id={`edit_address_modal_${address.id}`} buttonName={<FontAwesomeIcon
                            icon={faPen}/>}></ModalOpenButton>
                        <button className="btn btn-ghost" onClick={() => deleteAddress(address.id)}><FontAwesomeIcon
                            icon={faTrash}/></button>
                        <dialog id={`edit_address_modal_${address.id}`} className="modal">
                            <div className="modal-box">
                                <form method="dialog">
                                    <button
                                        className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                    </button>
                                </form>
                                <h3 className="font-bold text-lg">Edit the address: </h3>
                                <p className="py-4">{address.city}</p>
                                <form action={updateAddress}>
                                    <input type="hidden" id={`address_id_${address.id}`} name="address_id"
                                           value={address.id}/>
                                    <FormInput label={"Country: "} placeholder={"country"} name={"country"}
                                               value={address?.country}
                                               type={"text"}/>
                                    <FormInput label={"City: "} placeholder={"city"} name={"city"}
                                               value={address?.city}
                                               type={"text"}/>
                                    <FormInput label={"Address: "} placeholder={"address"} name={"address"}
                                               value={address?.address}
                                               type={"text"}/>
                                    <button
                                        type="submit"
                                        className="w-50 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Update Address
                                    </button>
                                </form>
                            </div>
                        </dialog>
                    </div>
                </li>))}
            </ul>

        </div>
    );
}