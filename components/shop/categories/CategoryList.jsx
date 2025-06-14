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
        <div className="overflow-x-auto">
            <table className="table w-full bg-base-100 rounded-2xl">
                <thead>
                <tr>
                    <th className="w-1/3">Nume categorie</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category) => (
                    <tr key={category.id}>
                        <td className="font-medium">{category.name}</td>

                        <td className="text-center">
              <span
                  className={`badge badge-soft ${category.is_active ? 'badge-success' : 'badge-error'}`}
              >
                {category.is_active ? 'Activă' : 'Inactivă'}
              </span>
                        </td>

                        <td className="text-center">
                            <ModalOpenButton
                                id={`edit_category_modal_${category.id}`}
                                buttonName={<><FontAwesomeIcon icon={faPen}/></>}
                                className={"btn-outline btn-info btn-circle"}
                            />

                            {/* Modal */}
                            <dialog id={`edit_category_modal_${category.id}`} className="modal text-left">
                                <div className="modal-box">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕
                                        </button>
                                    </form>

                                    <h3 className="font-bold text-lg mb-2 text-left">Editează categoria</h3>

                                    <form action={updateCategory} id={`edit-form-${category.id}`} className="mt-4">
                                        <input type="hidden" name="category_id" value={category.id}/>

                                        <FormInput
                                            label="Nume categorie"
                                            placeholder="Ex: Produse vegane"
                                            name="name"
                                            value={category?.name}
                                            type="text"
                                        />

                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-between">
                                                <input
                                                    type="checkbox"
                                                    name="is_active"
                                                    defaultChecked={category.is_active}
                                                    className="toggle toggle-primary"
                                                />
                                                <span
                                                    className="label-text mr-2 text-white">{category.is_active ? 'Activă' : 'Inactivă'}</span>
                                            </label>
                                        </div>

                                        <SaveButton
                                            formId={`edit-form-${category.id}`}
                                            modalId={`edit_category_modal_${category.id}`}
                                        />
                                    </form>
                                </div>
                            </dialog>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}