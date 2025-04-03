'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export async function saveAddress(formData) {
    const supabase = await createSupabaseServerClient();
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id;
    const data = {
        user_id: userId,
        country: formData.get("country"),
        city: formData.get("city"),
        address: formData.get("address")
    };
    const {error} = await supabase
        .from('addresses')
        .insert([
            data,
        ])
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}

export async function updateAddress(formData) {
    const supabase = await createSupabaseServerClient();

    const {data: {user}} = await supabase.auth.getUser();

    const userId = user.id;

    const data = {
        id: formData.get("address_id"),
        country: formData.get("country"),
        city: formData.get("city"),
        address: formData.get("address")
    }

    const {error} = await supabase
        .from('addresses')
        .update(data)
        .eq('id', data.id)
        .eq("user_id", userId)
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}

export async function deleteAddress(addressId) {
    console.log(addressId)
    const supabase = await createSupabaseServerClient();

    const {error} = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}