'use client'
import {useMemo, useState} from 'react'
import {useRouter} from 'next/navigation'

export default function SubtotalComponent({cartProducts, userAddresses, userEmail}) {
    const [selectedAddress, setSelectedAddress] = useState('')
    const router = useRouter()

    const subtotal = useMemo(() => {
        if (!cartProducts || cartProducts.length === 0) return 0
        return cartProducts.reduce((acc, item) => acc + item.quantity * item.product.price, 0)
    }, [cartProducts])

    const totalItems = useMemo(() => {
        return cartProducts.reduce((acc, item) => acc + item.quantity, 0)
    }, [cartProducts])

    const handleCheckout = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address.')
            return
        }

        try {
            const res = await fetch('/api/stripe/checkout_sessions', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    cartProducts,
                    addressId: selectedAddress,
                    userEmail: userEmail
                }),
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (err) {
            console.error('Checkout error:', err)
        }
    }

    return (
        <>
            <h2>Sumar comanda</h2>
            <pre>Number of items: {totalItems}</pre>

            <div className="p-4 bg-gray-100 rounded">
                <h2 className="text-lg font-semibold">Subtotal</h2>
                <p className="text-xl font-bold">{subtotal.toFixed(2)} RON</p>
            </div>

            <h3>Choose delivery address:</h3>
            <select
                className="select"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
            >
                <option value="">Choose an address</option>
                {userAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                        {address.address}, {address.city}
                    </option>
                ))}
            </select>

            <section className="mt-3">
                <button type="button" onClick={handleCheckout} className="btn btn-primary w-full">
                    Checkout
                </button>
            </section>
        </>
    )
}