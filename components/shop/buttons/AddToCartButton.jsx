"use client";
import React, {useState, useTransition} from 'react';
import {updateCart} from "@/app/(shop)/shop/actions";

function AddToCartButton({userId, productId, initialQuantity}) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [isPending, startTransition] = useTransition();

    // console.log(initialQuantity);

    const handleCartUpdate = (newQuantity) => {
        setQuantity(newQuantity);
        startTransition(async () => {
            await updateCart(userId, productId, newQuantity);
        });
    };

    return (
        <div className="flex items-center space-x-2">
            <button onClick={() => handleCartUpdate(quantity + 1)} disabled={isPending}
                    className="btn px-4 py-2 bg-blue-500 text-white rounded">Add to Cart
            </button>
        </div>
    );
}

export default AddToCartButton;