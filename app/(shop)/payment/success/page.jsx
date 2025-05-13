import {redirect} from 'next/navigation'
import {stripe} from "@/utils/stripe/lib/stripe";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import addBusinessDays from "@/utils/date/deliveryDate";

export default async function Success({searchParams}) {
    const {session_id} = await searchParams

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items.data.price.product', 'payment_intent']
    });

    const {status, customer_details: {email: customerEmail}, amount_subtotal, metadata} = session;
    const lineItems = session.line_items.data;
    const subtotal = amount_subtotal / 100; // for getting the RON value

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        const supabase = await createSupabaseServerClient();
        const {data: {user}, userError} = await supabase.auth.getUser();
        const deliveryTime = addBusinessDays(new Date(), 3).split('T')[0];

        if (userError) {
            return redirect('/');
        }

        const orderItems = lineItems.map(item => ({
            quantity: item.quantity,
            unit_price: item.price.unit_amount / 100,
            currency: item.price.currency,
            db_product_id: parseInt(item.price.product?.metadata?.db_product_id) || null,
        }));

        const data = {
            user_id: user.id, // if you have it from session or metadata
            status: 'paid',
            total_price: subtotal,
            stripe_session_id: session_id,
            address_id: parseInt(metadata.address_id) || null,
            delivery_time: deliveryTime
        }


        // Step 1: Insert into 'orders' table
        const {data: orderData, error: orderError} = await supabase
            .from('orders')
            .insert(data)
            .select()
            .single()

        if (orderError?.code === '23505') {
            // Unique violation - order already exists
            console.log('Order already exists, skipping.');
            return redirect('/')
        }

        // Step 2: Insert into 'order_products' table
        const {error: productsError} = await supabase
            .from('order_products')
            .insert(orderItems.map(item => ({
                order_id: orderData.id,
                product_id: item.db_product_id,
                quantity: item.quantity,
                product_price: item.unit_price,
            })))

        // Step 3: Update product stock
        for (const item of orderItems) {
            if (!item.db_product_id) continue;

            const {error: updateError} = await supabase.rpc('update_product_stock', {
                product_id: item.db_product_id,
                quantity: item.quantity
            });

            if (updateError) {
                console.error(`❌ Failed to update stock for product ${item.db_product_id}:`, updateError);
            }
        }

        // Step 4: Delete products from shopping cart
        const {error: cartDeleteError} = await supabase
            .from('cart_products')
            .delete()
            .eq('user_id', user.id);

        if (cartDeleteError) {
            console.error('❌ Failed to clear cart after order:', cartDeleteError);
            // Optionally notify the user or log for later processing
        }

        if (productsError) {
            console.error('Error creating order_products:', productsError)
            throw new Error('Failed to create order products.')
        }

        console.log('✅ Order successfully created.')

        return (
            <section id="success">
                <p>
                    We appreciate your business! A confirmation email will be sent to{' '}
                    {customerEmail}. If you have any questions, please email{' '}
                </p>
                <a href="mailto:orders@example.com">orders@example.com</a>.
            </section>
        )
    }
}