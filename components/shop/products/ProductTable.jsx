import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faPen} from "@fortawesome/free-solid-svg-icons";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import FormInput from "@/components/auth/forms/FormInput";
import {updateActiveProductToggle, updateProduct} from "@/app/(shop)/admin/actions";
import DeleteProductImagesButton from "@/components/shop/products/DeleteProductImagesButton";
import SaveButton from "@/components/shop/products/SaveButton";
import Link from "next/link";
import ToggleButton from "@/components/shop/products/ToggleButton";
import InputLabel from "@/components/forms/InputLabel";


async function ProductTable({products}) {
    return (
        <div>
            <div className="overflow-x-auto rounded-2xl shadow-sm">
                <table className="min-w-full table-auto bg-base-200">
                    <thead className="bg-base-100">
                    <tr className="text-left text-sm font-semibold">
                        <th className="p-4">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Active</th>
                        <th className="p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="text-sm even:bg-base-100 hover:bg-base-content/15 transition">
                            <td className="px-4 py-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle h-12 w-12">
                                        <img
                                            src={product.images?.[0]?.publicUrl || "/PROTEINA.jpg"}
                                            alt={product.name}
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 font-medium">{product.name}</td>
                            <td className="px-4 py-3 max-w-xs truncate">{product.description}</td>
                            <td className="px-4 py-3">RON {product.price}</td>
                            <td className="px-4 py-3">{product.stock}</td>
                            <td className="px-4 py-3">{product.category.name}</td>
                            <td className="px-4 py-3">
                                <ToggleButton
                                    productId={product.id}
                                    isActive={product.is_active}
                                    toggleAction={updateActiveProductToggle}
                                />
                            </td>
                            <td className="px-4 py-3 space-x-2">
                                <ModalOpenButton
                                    id={`edit-modal-${product.id}`}
                                    buttonName={<FontAwesomeIcon icon={faPen} size="lg"/>}
                                    className="btn btn-sm btn-circle btn-outline btn-warning"
                                ></ModalOpenButton>
                                <Link href={`/shop/product/${product.id}`}
                                      className={"btn btn-sm btn-circle btn-outline btn-success"}><FontAwesomeIcon
                                    icon={faEye} size="lg"/></Link>
                                <dialog id={`edit-modal-${product.id}`} className="modal">
                                    <div className="modal-box">
                                        <form method="dialog">
                                            <button
                                                className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                            </button>
                                        </form>
                                        <h3 className="font-bold text-lg">Edit product {product.name}</h3>
                                        <form action={updateProduct} id={`edit-form-${product.id}`}
                                              className="mt-4">
                                            <input type="hidden" id={`product_id_${product.id}`} name="id"
                                                   value={product.id}/>
                                            <FormInput type="text" name="name" label="Product name"
                                                       value={product.name}/>
                                            <FormInput type="text" name="description" label="Product description"
                                                       value={product.description}/>
                                            <FormInput type="number" name="price" label="Product price"
                                                       value={product.price}/>
                                            <FormInput type="number" name="stock" label="Product stock"
                                                       value={product.stock}/>
                                            <div className="space-y-2">
                                                <InputLabel label={"Current images"}/>
                                                <DeleteProductImagesButton
                                                    product={product}></DeleteProductImagesButton>
                                                <div className="pt-4">
                                                    <InputLabel label={"Replace image(s)"}/>
                                                    <input type="file" className="file-input w-full" id="images"
                                                           multiple
                                                           accept="image/*"
                                                           name="images"/>
                                                    <p className="text-xs text-base-content/75 mt-1 text-end">Optional –
                                                        incarca imaginile noi</p>
                                                </div>
                                            </div>
                                            <SaveButton formId={`edit-form-${product.id}`}
                                                        modalId={`edit-modal-${product.id}`}/>
                                        </form>
                                    </div>
                                </dialog>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default ProductTable;