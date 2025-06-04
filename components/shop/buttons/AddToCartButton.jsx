"use client";
import React, {useState, useTransition} from 'react';
import {updateCart} from "@/app/(shop)/shop/actions";

function AddToCartButton({userId, productId, initialQuantity, isDisabled}) {
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
        <button onClick={() => handleCartUpdate(quantity + 1)} disabled={isPending}
                className={`btn w-full px-4 py-2 bg-white text-base-100 ${!isDisabled ? 'btn-disabled' : ''}`}>Add to
            Cart
        </button>
    );
}

export default AddToCartButton;