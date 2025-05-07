"use server";

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

// Add or update cart item
export async function updateCart(userId, productId, quantity) {
    const supabase = await createSupabaseServerClient();
    console.log(userId, productId, quantity);
    // If quantity is 0, remove item from cart
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

    // Upsert to either insert or update existing item
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

// Fetch user cart
export async function getCart(userId) {
    const supabase = await createSupabaseServerClient();
    const {data, error} = await supabase
        .from("cart_products")
        .select("product_id, quantity")
        .eq("user_id", userId);
    if (error) return {success: false, message: "Failed to fetch cart", cart: []};
    return {success: true, cart: data};
}

// New function: Remove an item completely
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