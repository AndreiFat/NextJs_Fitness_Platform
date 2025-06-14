'use server';

import {createSupabaseServerClient} from '@/utils/supabase/server';
import {revalidatePath} from "next/cache";

// Toggle favorite (Add/Remove)
// Toggle favorite (Add/Remove)
export async function toggleFavorite(userId, productId) {
    const supabase = await createSupabaseServerClient();

    // Check if the product is already favorited
    const {data: favorites, error} = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId);

    if (error) {
        console.error(error);
        return {success: false, message: 'Error checking favorite'};
    }

    // If no favorite is found, we can add it to the favorites
    if (favorites.length === 0) {
        const {error: insertError} = await supabase
            .from('favorites')
            .insert([{user_id: userId, product_id: productId}]);

        if (insertError) {
            return {success: false, message: 'Failed to add favorite'};
        }
        revalidatePath("/", "layout")
        return {success: true, isFavorite: true};
    }
    console.log(favorites);
    console.log(favorites[0]);
    // If favorite exists, remove it
    const {error: deleteError} = await supabase
        .from('favorites')
        .delete()
        .eq('id', favorites[0].id); // Use the first favorite (should be only one)

    if (deleteError) {
        return {success: false, message: 'Failed to remove favorite'};
    }
    revalidatePath("/", "layout")
    return {success: true, isFavorite: false};
}