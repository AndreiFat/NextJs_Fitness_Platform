import {createSupabaseServerClient} from "@/utils/supabase/server";
import OrderList from "@/components/shop/orders/OrderList";

export const metadata = {
    title: "AdminOrders",
    description: "Page for AdminOrders",
};

export default async function AdminOrders() {
    const supabase = await createSupabaseServerClient();

    const {data: orders, orderError} = await supabase
        .from('orders')
        .select('id, status, total_price, created_at, delivery_time, is_invoice_generated, tracking_id, ' +
            'address: addresses(id, city, address, country),' +
            'user: users(full_name, email, phone)')
        .order('created_at', {ascending: false})
        .range(0, 10);
    console.log(orders);
    return (
        <div className="container mx-auto py-5">
            <h1>AdminOrders</h1>
            <OrderList orders={orders}></OrderList>
        </div>
    );
}
