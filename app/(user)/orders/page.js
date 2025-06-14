import {createSupabaseServerClient} from "@/utils/supabase/server";
import OrderList from "@/components/shop/orders/OrderList";

export const metadata = {
    title: "Comenzile utilizatorului",
    description: "Page for UserOrders",
};

export default async function UserOrders() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}, error} = await supabase.auth.getUser();

    const {data: orders, orderError} = await supabase
        .from('orders')
        .select('id, status, total_price, created_at, delivery_time, is_invoice_generated, tracking_id, invoice_url, address: addresses(id, city, address, country), user: users(full_name, email, phone)')
        .eq("user_id", user.id)
        .order('created_at', {ascending: false});

    return (
        <div className="container mx-auto py-5 pt-32 px-4 md:px-0">
            <OrderList orders={orders}></OrderList>
        </div>
    );
}
