import {createSupabaseServerClient} from "@/utils/supabase/server";
import ProductImageViewer from "@/components/shop/products/ProductImageViewer";
import {deleteReview, saveReview, updateReview} from "@/app/(shop)/shop/actions";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import FormInput from "@/components/auth/forms/FormInput";
import SaveButton from "@/components/shop/products/SaveButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const metadata = {
    title: "Product",
    description: "Page for Product",
};

export default async function Product({params}) {
    const supabase = await createSupabaseServerClient();
    const {id} = await params;

    const {data: {user}, userError} = await supabase.auth.getUser();

    if (userError) {
        console.error("Error fetching user:", userError);
    }

    const {data: product, error} = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !product) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
            </div>
        );
    }

    const {data: reviews, reviewError} = await supabase
        .from('reviews')
        .select('*')
        .eq("product_id", product.id)

    if (reviewError) {
        console.error("Error fetching review:", reviewError);
    }

    console.log(reviews);

    const averageRating = reviews && reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.stars || 0), 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 flex gap-8">
            {/* Left side - Images */}
            <div className="w-100">
                <ProductImageViewer images={product.images}/>
            </div>

            {/* Right side - Details */}
            <div className="w-1/2 space-y-4">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-lg text-gray-700"><span className="font-semibold">ID:</span> {product.id}</p>
                <p className="text-gray-600"><span className="font-semibold">Description:</span> {product.description}
                </p>
                <p className="text-2xl text-indigo-600 font-bold">
                    ${product.price}
                </p>
                {averageRating && (
                    <p className="text-sm text-yellow-600">⭐ Average Rating: {averageRating} / 5 </p>
                )}
                <p className="text-gray-600"><span className="font-semibold">Stock:</span> {product.stock}</p>
                <p>
                    <span className="font-semibold text-gray-600">Status:</span>{" "}
                    {product.is_active ? (
                        <span
                            className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</span>
                    ) : (
                        <span
                            className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">Inactive</span>
                    )}
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex gap-2">

                    <ModalOpenButton id={"addReviewForm"} buttonName={"Add new review"}></ModalOpenButton>
                    <dialog id={"addReviewForm"} className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                <button
                                    className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                </button>
                            </form>
                            <h3 className="font-bold text-lg">Write a review: </h3>
                            <form id="add-review-form" action={saveReview}
                                  className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-2">
                                <input type="hidden" name="product_id" value={product.id}/>
                                <FormInput label="Title: " name="title" type="text" placeholder="Review title:"/>
                                <FormInput label="Description: " name="description" type="text"
                                           placeholder="Review description:"/>
                                <div className="rating">
                                    <input type="radio" name="stars" value="1"
                                           className="mask mask-star-2 bg-orange-400"
                                           aria-label="1 star"/>
                                    <input type="radio" name="stars" value="2"
                                           className="mask mask-star-2 bg-orange-400"
                                           aria-label="2 star" defaultChecked/>
                                    <input type="radio" name="stars" value="3"
                                           className="mask mask-star-2 bg-orange-400"
                                           aria-label="3 star"/>
                                    <input type="radio" name="stars" value="4"
                                           className="mask mask-star-2 bg-orange-400"
                                           aria-label="4 star"/>
                                    <input type="radio" name="stars" value="5"
                                           className="mask mask-star-2 bg-orange-400"
                                           aria-label="5 star"/>
                                </div>

                                <SaveButton formId="add-review-form" modalId="addReviewForm" label="Save Review"/>
                            </form>
                        </div>
                    </dialog>
                </div>
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-yellow-500 text-lg">{"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}</span>
                                <span className="text-gray-600 text-sm">{review.stars}/5</span>
                            </div>
                            {user?.id === review.user_id && (
                                <div className="flex gap-3">
                                    {/*<form action={updateReview}>*/}
                                    {/*    <input type="hidden" name="reviewId" value={review.id}/>*/}
                                    {/*    <button className="text-blue-600 text-sm hover:underline">Edit</button>*/}
                                    {/*</form>*/}
                                    <ModalOpenButton id={`edit_review_modal_${review.id}`} buttonName={<FontAwesomeIcon
                                        icon={faPen}/>}></ModalOpenButton>
                                    <dialog id={`edit_review_modal_${review.id}`} className="modal">
                                        <div className="modal-box">
                                            <form method="dialog">
                                                <button
                                                    className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                                </button>
                                            </form>
                                            <h3 className="font-bold text-lg">Edit the review: </h3>
                                            <p className="py-4">{review.title}</p>
                                            <form action={updateReview} id={`edit-form-${review.id}`}>
                                                <input type="hidden" id={`review_id_${review.id}`}
                                                       name="review_id"
                                                       value={review.id}/>
                                                <FormInput label={"Review title: "} placeholder={"Title"} name={"title"}
                                                           value={review?.title} type={"text"}/>
                                                <FormInput label={"Review description: "} placeholder={"Description"}
                                                           name={"description"}
                                                           value={review?.description} type={"text"}/>

                                                <div className="rating">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <input
                                                            key={star}
                                                            type="radio"
                                                            name="stars"
                                                            value={star}
                                                            className="mask mask-star-2 bg-orange-400"
                                                            aria-label={`${star} star`}
                                                            defaultChecked={review.stars === star}
                                                        />
                                                    ))}
                                                </div>


                                                <SaveButton formId={`edit-form-${review.id}`}
                                                            modalId={`edit_review_modal_${review.id}`}/>
                                            </form>
                                        </div>
                                    </dialog>
                                    <form action={deleteReview}>
                                        <input type="hidden" name="reviewId" value={review.id}/>
                                        <button className="text-red-600 text-sm hover:underline">Delete</button>
                                    </form>
                                </div>
                            )}
                        </div>
                        <p className="mt-3 text-gray-700">{review.title}</p>
                        <p className="mt-3 text-gray-700">{review.description}</p>
                    </div>
                ))}
            </div>


        </div>
    );
}