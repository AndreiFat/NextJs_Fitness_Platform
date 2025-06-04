import React from 'react';
import Link from "next/link";
import {faCircleDot, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {createSupabaseServerClient} from "@/utils/supabase/server";

async function Product({product, addToFavoriteButton, addToCartButton}) {
    const supabase = await createSupabaseServerClient()

    const {data: reviews, count: reviewsCount, error: reviewsError} = await supabase
        .from('reviews')
        .select('*', {count: 'exact'})
        .eq('product_id', product.product_id);

    const averageRating = reviews && reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.stars || 0), 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="relative card bg-base-100">
            {!product.is_active && (
                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-xl">
                </div>
            )}

            <Link href={`/shop/product/${product.id}`}>
                <div
                    className="h-[350px] w-full bg-cover bg-center rounded-t-xl"
                    style={{
                        backgroundImage: `url(${product.images[0]?.publicUrl})`
                    }}
                ></div>
            </Link>

            <div className="card-body relative z-20">
                <Link href={`/shop/product/${product.id}`}>
                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    {product.is_active ?
                        <span className={"flex gap-2 items-center text-success"}><FontAwesomeIcon size={"lg"}
                                                                                                  icon={faCircleDot}/>In Stock</span> :
                        <span className={"flex gap-2 items-center text-error"}><FontAwesomeIcon size={"lg"}
                                                                                                icon={faCircleXmark}/>Out of Stock</span>}
                    {averageRating ? (
                        <p className="text-sm text-yellow-600">⭐ Average Rating: {averageRating} / 5 </p>
                    ) : <p>No ratings yet.</p>}
                </Link>
                <div className={"flex gap-2 items-center w-full"}>
                    <div className={"w-full"}>{addToCartButton}</div>
                    <div>{addToFavoriteButton}</div>
                </div>

            </div>
        </div>
    );
}

export default Product;