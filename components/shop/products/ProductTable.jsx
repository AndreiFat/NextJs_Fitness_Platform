import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import FormInput from "@/components/auth/forms/FormInput";
import {updateActiveProductToggle, updateProduct} from "@/app/(shop)/admin/actions";
import DeleteProductImagesButton from "@/components/shop/products/DeleteProductImagesButton";
import SaveButton from "@/components/shop/products/SaveButton";
import Link from "next/link";
import {faLocationArrow} from "@fortawesome/free-solid-svg-icons/faLocationArrow";
import ToggleButton from "@/components/shop/products/ToggleButton";


async function ProductTable({products}) {
    return (
        <div className="px-4 sm:px-8">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full table-auto bg-white">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr className="text-left text-sm font-semibold">
                        <th className="px-4 py-3">Image</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Active</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="text-sm even:bg-gray-50 hover:bg-gray-100 transition">
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
                            <td className="px-4 py-3">${product.price}</td>
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
                                    buttonName={<FontAwesomeIcon icon={faPen}/>}
                                    className="btn btn-sm btn-outline btn-primary"
                                ></ModalOpenButton>
                                <Link href={`/shop/product/${product.id}`}><FontAwesomeIcon
                                    icon={faLocationArrow}/></Link>
                                <dialog id={`edit-modal-${product.id}`} className="modal">
                                    <div className="modal-box">
                                        <form method="dialog">
                                            <button
                                                className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                            </button>
                                        </form>
                                        <h3 className="font-bold text-lg">Edit product: {product.name}</h3>
                                        <form action={updateProduct} id={`edit-form-${product.id}`}
                                              className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-2">
                                            <input type="hidden" id={`product_id_${product.id}`} name="id"
                                                   value={product.id}/>
                                            <FormInput type="text" name="name" label="Product name:"
                                                       value={product.name}/>
                                            <FormInput type="text" name="description" label="Product description:"
                                                       value={product.description}/>
                                            <FormInput type="number" name="price" label="Product price:"
                                                       value={product.price}/>
                                            <FormInput type="number" name="stock" label="Product stock:"
                                                       value={product.stock}/>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Current
                                                    Images:</label>
                                                <DeleteProductImagesButton
                                                    product={product}></DeleteProductImagesButton>
                                                <div className="pt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Replace
                                                        image(s):</label>
                                                    <input type="file" className="file-input" id="images" multiple
                                                           accept="image/*"
                                                           name="images"/>
                                                    <p className="text-xs text-gray-500 mt-1">Optional – upload new
                                                        files</p>
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