'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

export async function modifyStatus(formData) {
    const supabase = await createSupabaseServerClient();

    const order_id = formData.get('order_id');
    const status = formData.get('status');
    const tracking_id = formData.get('tracking_id');
    console.log(order_id, status, tracking_id);

    if (!order_id || !status) return;

    const updateData = {status};

    if (tracking_id) {
        updateData.tracking_id = tracking_id;
    }

    const {error} = await supabase.from('orders').update(updateData).eq('id', order_id);
    if (error) throw error;

    revalidatePath('/admin/orders', 'layout')
}