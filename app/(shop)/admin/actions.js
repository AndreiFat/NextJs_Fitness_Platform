'use server'

import {createSupabaseServerClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function saveProduct(formData) {
    const supabase = await createSupabaseServerClient(formData);

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const images = formData.getAll("images");
    const category_id = formData.get("category_id");

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
                category_id
            }
        ]);

    if (insertError) {
        console.error("Error inserting product:", insertError);
        return {success: false, error: insertError.message};
    }

    revalidatePath("/", "layout")

    return {success: true};
}

export async function updateProduct(formData) {
    const supabase = await createSupabaseServerClient();

    const data = {
        id: formData.get("id"),
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock")
    }

    const files = formData.getAll("images");
    const newImages = [];

    //console.log(files) //merge

    for (const file of files) {
        if (!file?.size) continue;

        const filename = `products/${Date.now()}_${file.name}`;
        const {data, error: uploadError} = await supabase.storage
            .from("productimages")
            .upload(filename, file);

        //console.log(data) //merge

        if (!uploadError) {
            const {data: publicData} = supabase.storage.from("productimages").getPublicUrl(filename);
            //console.log(publicData.publicUrl);
            newImages.push({publicUrl: publicData.publicUrl});
            //console.log("newimages" + newImages[0].publicUrl)
        }
    }

    const {data: existing, existingError} = await supabase
        .from("products")
        .select("images")
        .eq("id", data.id)
        .single();

    const existingImages = (() => {
        if (!existing?.images) return [];
        if (typeof existing.images === 'string') {
            try {
                return JSON.parse(existing.images);
            } catch {
                return [];
            }
        }
        if (Array.isArray(existing.images)) {
            return existing.images;
        }
        return [];
    })();

    const updatedImages = [...existingImages, ...newImages];

    //console.log(updatedImages);

    const {error} = await supabase
        .from('products')
        .update({
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            images: updatedImages
        })
        .eq('id', data.id)
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/admin/products', 'layout');
    // redirect('/admin/products');
}

export async function deleteProductImage({productId, imageUrl}) {
    console.log("se incearca stergerea")
    const supabase = await createSupabaseServerClient();

    const {data: product, error} = await supabase
        .from("products")
        .select("images")
        .eq("id", productId)
        .single();

    if (error) return {error: "Product not found."};

    const updatedImages = product.images.filter(img => img.publicUrl !== imageUrl);

    await supabase
        .from("products")
        .update({images: updatedImages})
        .eq("id", productId);

    const path = new URL(imageUrl).pathname.split("/storage/v1/object/public/")[1];
    await supabase.storage.from("productimages").remove([path]);

    return {success: true};
}

export async function updateActiveProductToggle(formData) {
    const supabase = await createSupabaseServerClient();

    const productId = formData.get("productId");
    const currentStatus = formData.get("currentStatus") === "true";

    console.log(formData.get("currentStatus"))
    console.log("currentStatus", currentStatus);
    console.log(productId)

    const {error} = await supabase
        .from('products')
        .update({is_active: !currentStatus})
        .eq('id', productId);

    if (error) {
        console.error(error);
        throw new Error('Failed to toggle active status');
    }

    revalidatePath('/admin/products', 'layout');
}

export async function updateCategory(formData) {
    const supabase = await createSupabaseServerClient();

    const data = {
        id: formData.get("category_id"),
        name: formData.get("name")
    }
    //console.log("FORM ACTIVE", formData.get("is_active"))
    const isActive = formData.get("is_active") === "true";
    //console.log("isActive", isActive);

    const {error} = await supabase
        .from('categories')
        .update({name: data.name, is_active: !isActive})
        .eq('id', data.id)
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}

export async function saveCategory(formData) {
    const supabase = await createSupabaseServerClient(formData);

    const data = {
        name: formData.get("name")
    };

    const {error} = await supabase
        .from('categories')
        .insert(data)
        .select()

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
}