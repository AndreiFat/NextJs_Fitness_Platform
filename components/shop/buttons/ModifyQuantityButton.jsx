'use client'
import {removeFromCart, updateCart} from "@/app/(shop)/shop/actions";
import {useState, useTransition} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";

function ModifyQuantityButton({userId, productId, initialQuantity}) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [isPending, startTransition] = useTransition();

    const handleRemove = () => {
        setQuantity(0);
        startTransition(async () => {
            await removeFromCart(userId, productId);
        });
    };

    const handleCartUpdate = (newQuantity) => {
        setQuantity(newQuantity);
        startTransition(async () => {
            await updateCart(userId, productId, newQuantity);
        });
    };

    return (
        <div className="flex items-center space-x-2">
            <button onClick={() => handleCartUpdate(quantity - 1)} disabled={isPending}
                    className="btn-sm btn-square bg-red-500 text-white rounded"><FontAwesomeIcon
                icon={faMinus}></FontAwesomeIcon>
            </button>
            <span>{quantity}</span>
            <button onClick={() => handleCartUpdate(quantity + 1)} disabled={isPending}
                    className="btn-sm btn-square bg-green-500 text-white rounded"><FontAwesomeIcon
                icon={faPlus}></FontAwesomeIcon>
            </button>
            <button onClick={handleRemove} disabled={isPending}
                    className="btn-sm btn-square bg-gray-500 text-white rounded"><FontAwesomeIcon
                icon={faTrashCan}></FontAwesomeIcon>
            </button>
        </div>
    );
}

export default ModifyQuantityButton;