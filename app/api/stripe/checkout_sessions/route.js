import {NextResponse} from 'next/server'
import {headers} from 'next/headers'
import {stripe} from "@/utils/stripe/lib/stripe";

export async function POST(req) {
    const {cartProducts, addressId, userEmail} = await req.json()
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')
        console.log(cartProducts)
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: cartProducts.map((item) => ({
                price_data: {
                    currency: 'ron',
                    product_data: {
                        ...(
                            Object.keys(item.product.images).length !== 0 && {
                                images: [item.product.images[0].publicUrl],
                            }
                        ),
                        name: item.product.name,
                        description: item.product.description || 'descriere aici',
                    },
                    unit_amount: Math.round(item.product.price * 100),
                },
                quantity: item.quantity,
            })),
            customer_email: userEmail,
            mode: 'payment',
            submit_type: 'auto',
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?canceled=true`,
        });
        console.log(session.url)
        return NextResponse.json({url: session.url})
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            {error: err.message},
            {status: err.statusCode || 500}
        )
    }
}