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
        .select('id, status, total_price, created_at, delivery_time, is_invoice_generated, tracking_id, invoice_url, ' +
            'address: addresses(id, city, address, country),' +
            'user: users(full_name, email, phone)')
        .order('created_at', {ascending: false})
        .range(0, 10);

    return (
        <div className="container mx-auto py-5 pt-32">
            <p className=" text-center">
                <span className="uppercase font-bold mb-2 badge badge-soft text-sm badge-lg">Admin Panel</span>
            </p>
            <OrderList orders={orders}></OrderList>
        </div>
    );
}
