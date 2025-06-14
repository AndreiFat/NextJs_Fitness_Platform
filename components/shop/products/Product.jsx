'use client'
import React, {useEffect, useState} from 'react';
import Link from "next/link";
import {faCircleDot, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {createSupabaseClient} from "@/utils/supabase/client";

function Product({product, addToFavoriteButton, addToCartButton}) {
    const [supabase] = useState(() => createSupabaseClient());
    const [reviews, setReviews] = useState([]);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [error, setError] = useState(null);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.stars || 0), 0) / reviews.length).toFixed(1)
        : null;

    useEffect(() => {
        const fetchReviews = async () => {
            const {data, count, error} = await supabase
                .from("reviews")
                .select("*", {count: "exact"})
                .eq("product_id", product.id);

            if (error) {
                setError(error);
                console.log(error);
            } else {
                setReviews(data);
                setReviewsCount(count);
                console.log("count:", count);
            }
        };

        fetchReviews();
    }, [product.id, supabase]);

    return (
        <div className="relative card bg-base-100">
            {!product.is_active && (
                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-xl">
                </div>
            )}

            <Link href={`/shop/product/${product.id}`}>
                <div
                    className="h-[300px] w-full bg-cover bg-center rounded-t-xl"
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
                    <div className={"my-2"}>
                        {averageRating ? (
                            <p className="text-sm text-yellow-600">⭐ Average Rating: {averageRating} / 5 </p>
                        ) : <p>No ratings yet.</p>}
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-primary">RON {product.price}</span>
                        <span className="text-sm text-base-content/75 ml-1">incl. TVA</span>
                    </div>
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