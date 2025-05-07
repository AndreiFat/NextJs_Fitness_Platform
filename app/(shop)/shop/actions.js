'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function updateReview(formData) {
    console.log("se incearca editul")
    const supabase = await createSupabaseServerClient();

    const data = {
        id: formData.get("review_id"),
        title: formData.get("title"),
        description: formData.get("description")
    }

    const starsRaw = formData.get("stars");
    const stars = starsRaw ? parseInt(starsRaw, 10) : null;

    const {error} = await supabase
        .from('reviews')
        .update({
            title: data.title,
            description: data.description,
            stars: stars
        })
        .eq('id', data.id)
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}

export async function deleteReview(formData) {
    console.log("se incearca delete review")
    const supabase = await createSupabaseServerClient();

    const reviewId = formData.get("reviewId");

    const {error} = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)

    revalidatePath('/', 'layout');
}

export async function saveReview(formData) {
    console.log("se incearca save review")
    const supabase = await createSupabaseServerClient();

    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        stars: formData.get("stars"),
        product_id: formData.get("product_id")
    }

    const {error} = await supabase
        .from('reviews')
        .insert(data)
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}

export async function updateCart(userId, productId, quantity) {
    const supabase = await createSupabaseServerClient();
    console.log(userId, productId, quantity);

    if (quantity === 0) {
        const {error} = await supabase
            .from("cart_products")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", productId);
        if (error) return {success: false, message: "Failed to remove item"};

        revalidatePath("/shop/shopping-cart", "layout")
        return {success: true, isInCart: false};
    }

    const {error} = await supabase
        .from("cart_products")
        .upsert([{user_id: userId, product_id: productId, quantity}], {onConflict: ["user_id", "product_id"]});

    if (error) {
        console.log(error);
        return {
            success: false, message: "Failed to update cart"
        };
    }
    revalidatePath("/shop/shopping-cart", "layout")
    return {success: true, isInCart: true};
}

export async function getCart(userId) {
    const supabase = await createSupabaseServerClient();
    const {data, error} = await supabase
        .from("cart_products")
        .select("product_id, quantity")
        .eq("user_id", userId);
    if (error) return {success: false, message: "Failed to fetch cart", cart: []};
    return {success: true, cart: data};
}

export async function removeFromCart(userId, productId) {
    const supabase = await createSupabaseServerClient();
    const {error} = await supabase
        .from("cart_products")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

    if (error) return {success: false, message: "Failed to remove item"};
    revalidatePath("/shop/shopping-cart", "layout")
    return {success: true};
}