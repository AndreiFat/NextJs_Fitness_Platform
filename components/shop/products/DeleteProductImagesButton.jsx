'use client'

import React, {useState} from 'react';
import {deleteProductImage} from "@/app/(shop)/admin/actions";

function DeleteProductImagesButton({product}) {
    const [images, setImages] = useState(() => {
        if (Array.isArray(product.images)) return product.images;
        try {
            return JSON.parse(product.images);
        } catch {
            return [];
        }
    });

    const handleDelete = async (imageUrl) => {
        const res = await deleteProductImage({productId: product.id, imageUrl});
        if (res?.success) {
            setImages((prev) => prev.filter(img => img.publicUrl !== imageUrl));
        }
    };

    return (
        <div className="grid grid-cols-3 gap-2">
            {images.map((img, index) => (
                <div key={index} className="relative">
                    <img
                        src={img.publicUrl}
                        alt={`Image ${index + 1}`}
                        className="h-24 w-full object-cover rounded border"
                    />
                    <button
                        type="button"
                        onClick={() => handleDelete(img.publicUrl)}
                        className="absolute top-1 right-1 bg-red-600 text-xs rounded-full px-1 py-0.5 hover:bg-red-700"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}

export default DeleteProductImagesButton;