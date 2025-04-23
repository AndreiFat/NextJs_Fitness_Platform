'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

export async function saveProduct(formData) {
    const supabase = await createSupabaseServerClient(formData);

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const images = formData.getAll("images");

    console.log(images)

    let imageUrls = [];

    for (const image of images) {
        const {data: imageData, error} = await supabase.storage
            .from("productimages") // Numele bucket-ului
            .upload(`products/${Date.now()}_${image.name}`, image);

        if (error) {
            console.error("Error uploading image:", error);
            continue;
        }

        const {data} = supabase.storage.from("productimages").getPublicUrl(imageData.path);
        console.log(data);
        imageUrls.push(data);
    }

    const {error: insertError} = await supabase
        .from("products")
        .insert([
            {
                name,
                description,
                price,
                stock,
                images: imageUrls,
            }
        ]);

    if (insertError) {
        console.error("Error inserting product:", insertError);
        return {success: false, error: insertError.message};
    }

    revalidatePath("/", "layout")

    return {success: true};
}