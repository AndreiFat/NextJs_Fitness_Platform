'use client'
import {useState, useTransition} from 'react'
import {removeFromCart, updateCart} from '@/app/(shop)/shop/actions'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMinus, faPlus, faTrashCan} from '@fortawesome/free-solid-svg-icons'

function ModifyQuantityButton({userId, productId, initialQuantity, stock}) {
    const [quantity, setQuantity] = useState(initialQuantity)
    const [isPending, startTransition] = useTransition()
    const [showAlert, setShowAlert] = useState(false)

    const handleRemove = () => {
        setQuantity(0)
        startTransition(() => removeFromCart(userId, productId))
    }

    const handleCartUpdate = (newQuantity) => {
        if (newQuantity < 1) return

        if (newQuantity > stock) {
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000) // ascunde după 3 secunde
            return
        }

        setQuantity(newQuantity)
        startTransition(() => updateCart(userId, productId, newQuantity))
    }

    return (
        <div className="flex flex-col gap-2 items-start">
            {showAlert && (
                <div className="toast toast-bottom toast-end z-50">
                    <div className="alert alert-error text-sm">
                        <span>Nu poți adăuga mai mult decât stocul disponibil ({stock}).</span>
                    </div>
                </div>
            )}

            <div className="flex items-center space-x-1.5">
                <button
                    onClick={() => handleCartUpdate(quantity - 1)}
                    disabled={isPending || quantity <= 1}
                    className="btn btn-sm btn-circle bg-error hover:text-white hover:bg-red-500"
                >
                    <FontAwesomeIcon icon={faMinus}/>
                </button>

                <span className="rounded-full bg-base-content/15 btn-circle btn pointer-events-none border-0 btn-sm">
          {quantity}
        </span>

                <button
                    onClick={() => handleCartUpdate(quantity + 1)}
                    disabled={isPending || quantity > stock}
                    className="btn btn-sm btn-circle bg-success hover:text-white hover:bg-green-500"
                >
                    <FontAwesomeIcon icon={faPlus}/>
                </button>

                <button
                    onClick={handleRemove}
                    disabled={isPending}
                    className="btn btn-sm btn-circle bg-gray-700 hover:text-white hover:bg-red-600"
                >
                    <FontAwesomeIcon icon={faTrashCan}/>
                </button>
            </div>
        </div>
    )
}

export default ModifyQuantityButton