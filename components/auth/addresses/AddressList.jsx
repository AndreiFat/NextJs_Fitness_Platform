'use client'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {deleteAddress, updateAddress} from "@/app/(user)/addresses/actions";
import FormInput from "@/components/auth/forms/FormInput";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import SaveButton from "@/components/shop/products/SaveButton";
import React from "react";

export default function AddressList({addresses}) {
    return (
        <div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((address) => (
                    <li key={address.id} className="rounded-xl shadow-md bg-base-200/75 p-5 relative">
                        <div className="flex flex-col gap-1 mb-4">
                            <h3 className="text-xl font-semibold text-white">{address.country}</h3>
                            <p className="text-gray-400">{address.city}</p>
                            <p className="text-gray-500">{address.address}</p>
                        </div>

                        <div className="flex justify-end items-center gap-3">
                            <ModalOpenButton
                                id={`edit_address_modal_${address.id}`} className={"btn-outline btn-info"}
                                buttonName={
                                    <>
                                        <FontAwesomeIcon icon={faPen}/> Editează
                                    </>
                                }
                            />
                            <button
                                className="btn btn-outline btn-error"
                                onClick={() => deleteAddress(address.id)}
                            >
                                <FontAwesomeIcon icon={faTrash}/> Șterge
                            </button>
                        </div>

                        {/* Modificare adresă */}
                        <dialog id={`edit_address_modal_${address.id}`} className="modal">
                            <div className="modal-box rounded-xl">
                                <form method="dialog">
                                    <button
                                        className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3"
                                        aria-label="Închide"
                                    >
                                        ✕
                                    </button>
                                </form>
                                <h3 className="font-semibold text-lg text-primary mb-4">Editează adresa</h3>

                                <form action={updateAddress} id={`edit-form-${address.id}`}>
                                    <input type="hidden" name="address_id" value={address.id}/>
                                    <FormInput
                                        label="Țară"
                                        name="country"
                                        type="text"
                                        placeholder="Țara"
                                        value={address.country}
                                    />
                                    <FormInput
                                        label="Oraș"
                                        name="city"
                                        type="text"
                                        placeholder="Oraș"
                                        value={address.city}
                                    />
                                    <FormInput
                                        label="Adresă completă"
                                        name="address"
                                        type="text"
                                        placeholder="Adresă completă"
                                        value={address.address}
                                    />
                                    <div className="pt-3">
                                        <SaveButton
                                            formId={`edit-form-${address.id}`}
                                            modalId={`edit_address_modal_${address.id}`}
                                            label="Salvează modificările"
                                        />
                                    </div>
                                </form>
                            </div>
                        </dialog>
                    </li>
                ))}
            </ul>
        </div>
    );
}