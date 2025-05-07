'use client'

import React from 'react';
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import FormInput from "@/components/auth/forms/FormInput";
import SaveButton from "@/components/shop/products/SaveButton";
import {updateCategory} from "@/app/(shop)/admin/actions";

export default function CategoryList({categories}) {
    return (
        <div>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {categories.map((category) => (
                    <li key={category.id} className="border p-4 rounded-md shadow-sm">
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <p className="text-gray-500">Activ: </p>
                        <pre>{category.is_active ? 'Active' : 'Inactive'}</pre>
                        <div className="flex gap-2">
                            <ModalOpenButton id={`edit_category_modal_${category.id}`} buttonName={<FontAwesomeIcon
                                icon={faPen}/>}></ModalOpenButton>
                            <dialog id={`edit_category_modal_${category.id}`} className="modal">
                                <div className="modal-box">
                                    <form method="dialog">
                                        <button
                                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                        </button>
                                    </form>
                                    <h3 className="font-bold text-lg">Edit the address: </h3>
                                    <p className="py-4">{category.name}</p>
                                    <form action={updateCategory} id={`edit-form-${category.id}`}>
                                        <input type="hidden" id={`category_id_${category.id}`} name="category_id"
                                               value={category.id}/>
                                        <FormInput label={"Category name: "} placeholder={"Name"} name={"name"}
                                                   value={category?.name}
                                                   type={"text"}/>

                                        <div className="form-control py-2">
                                            <label className="label cursor-pointer justify-start gap-4">
                                                <span className="label-text">Active</span>
                                                <input type="hidden" name="is_active" value={category.is_active}/>
                                                <input
                                                    type="checkbox"
                                                    name="is_active"
                                                    defaultChecked={category.is_active}
                                                    className={"toggle"}
                                                />
                                            </label>
                                        </div>

                                        <SaveButton formId={`edit-form-${category.id}`}
                                                    modalId={`edit_category_modal_${category.id}`}/>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                    </li>))}
            </ul>

        </div>
    )
}