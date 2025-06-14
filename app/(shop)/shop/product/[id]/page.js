import {createSupabaseServerClient} from "@/utils/supabase/server";
import ProductImageViewer from "@/components/shop/products/ProductImageViewer";
import {deleteReview, getCart, saveReview, updateReview} from "@/app/(shop)/shop/actions";
import ModalOpenButton from "@/components/auth/addresses/ModalOpenButton";
import FormInput from "@/components/auth/forms/FormInput";
import SaveButton from "@/components/shop/products/SaveButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleDot, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import InputLabel from "@/components/forms/InputLabel";
import AddToCartButton from "@/components/shop/buttons/AddToCartButton";
import SaveToFavoritesButton from "@/components/shop/buttons/SaveToFavoritesButton";

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

    const {data: products, count: productCount, error: productError} = await supabase
        .from('favorites')
        .select('product_id, products(*)', {count: 'exact'})
        .eq('user_id', user.id);

    if (error || !product) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
            </div>
        );
    }

    const {data: reviews, count: reviewCount, reviewError} = await supabase
        .from('reviews')
        .select('*, user: users(full_name)', {count: 'exact'})
        .eq("product_id", product.id)

    if (reviewError) {
        console.error("Error fetching review:", reviewError);
    }

    console.log(reviews);

    const averageRating = reviews && reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.stars || 0), 0) / reviews.length).toFixed(1)
        : null;

    // Fetch cart data
    const {cart} = await getCart(user.id);
    const cartItems = cart.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
    }, {});

    const favoriteIds = products ? products.map((fav) => fav.product_id) : [];

    return (
        product ? (
            <div className="px-4 md:px-0 gap-8 py-32">
                <div className={"max-w-6xl mx-auto p-6 bg-base-100 shadow-lg rounded-lg"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                        <div className="w-full">
                            <ProductImageViewer images={product.images}/>
                        </div>

                        <div className="w-full space-y-4">
                            <p className="text-sm"><span className="badge badge-soft"># {product.id}</span></p>
                            <h1 className="text-4xl font-bold">{product.name}</h1>
                            {averageRating && (
                                <p className="text-yellow-600">★ {averageRating} ({reviewCount} Recenzii) </p>
                            )}
                            <div className="text-sm p-4 bg-base-200 rounded-lg">
                                <p className="text-base-content/65 font-light mb-1">Descriere</p> {product.description}
                            </div>

                            {product.is_active && product.stock > 0 ? (
                                <span className={"flex gap-2 items-center text-success"}><FontAwesomeIcon size={"lg"}
                                                                                                          icon={faCircleDot}/>In Stoc ({product.stock} disponibile)</span>

                            ) : (<span className={"flex gap-2 items-center text-error"}><FontAwesomeIcon size={"lg"}
                                                                                                         icon={faCircleXmark}/>Lipsa Stoc</span>)}
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-primary">RON {product.price}</span>
                                <span className="text-sm text-base-content/75 ml-1">incl. TVA</span>
                            </div>
                            <div className={"flex gap-2 items-center w-full"}>
                                <div className={"w-full"}>{<AddToCartButton isDisabled={product.is_active}
                                                                            userId={user.id} productId={product.id}
                                                                            initialQuantity={cartItems[product.id] || 0}/>}</div>
                                <div><SaveToFavoritesButton userId={user.id} isDisabled={product.is_active}
                                                            productId={product.id}
                                                            initialFavorite={favoriteIds.includes(product.id)}/></div>
                            </div>
                        </div>
                    </div>
                    <div className={"divider"}></div>
                    <div className="space-y-4">
                        <div className="flex justify-between gap-2">
                            <div>
                                <h2 className={"text-2xl font-semibold"}>Recenzii</h2>
                                <p className={"text-base-content/75"}>Ce spun cumparatorii nostrii</p>
                            </div>
                            <ModalOpenButton id={"addReviewForm"} buttonName={"Adauga un review"}></ModalOpenButton>
                            <dialog id={"addReviewForm"} className="modal">
                                <div className="modal-box">
                                    <form method="dialog">
                                        <button
                                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                        </button>
                                    </form>
                                    <h3 className="font-bold text-lg mb-4">Scrie o recenzie</h3>
                                    <form id="add-review-form" action={saveReview}
                                          className="bg-base-100 p-2">
                                        <input type="hidden" name="product_id" value={product.id}/>
                                        <FormInput label="Titlu" name="title" type="text" placeholder="Titlu"/>
                                        <FormInput label="Descriere" name="description" type="text"
                                                   placeholder="Descriere"/>
                                        <div className="flex flex-col gap-2">
                                            <div>
                                                <InputLabel label={"Rating"}></InputLabel>
                                                <div className="rating flex gap-0.5 mb-4">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <input key={star} type="radio" name="stars" value={star}
                                                               className="mask mask-star-2 bg-orange-400"/>))}
                                                </div>
                                            </div>
                                            <SaveButton formId="add-review-form" modalId="addReviewForm"
                                                        label="Salveaza Recenzie"/>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                        {reviews.map((review) => (
                            <div key={review.id}
                                 className="border border-base-content/10 bg-base-200 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 md:gap-3">
                                        <h3 className={"text-xl font-semibold"}>{review.title}</h3>
                                        <div>
                                            <span
                                                className="text-yellow-600 text-xl mr-1">{"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}</span>
                                            <span className="">({review.stars}/5)</span>
                                        </div>
                                    </div>
                                    {user?.id === review.user_id && (
                                        <div className="flex gap-2 mb-3">
                                            {/*<form action={updateReview}>*/}
                                            {/*    <input type="hidden" name="reviewId" value={review.id}/>*/}
                                            {/*    <button className="text-blue-600 text-sm hover:underline">Edit</button>*/}
                                            {/*</form>*/}
                                            <ModalOpenButton id={`edit_review_modal_${review.id}`}
                                                             className={"btn-info"}
                                                             buttonName={"Editeaza"}></ModalOpenButton>
                                            <dialog id={`edit_review_modal_${review.id}`} className="modal">
                                                <div className="modal-box">
                                                    <form method="dialog">
                                                        <button
                                                            className="btn btn-sm bg-neutral/10 btn-circle btn-ghost absolute right-3 top-3">x
                                                        </button>
                                                    </form>
                                                    <h3 className="font-bold text-lg mb-4">Edit the review</h3>
                                                    <form action={updateReview} id={`edit-form-${review.id}`}
                                                          className={"p-2"}>
                                                        <input type="hidden" id={`review_id_${review.id}`}
                                                               name="review_id"
                                                               value={review.id}/>
                                                        <FormInput label={"Review title: "} placeholder={"Title"}
                                                                   name={"title"}
                                                                   value={review?.title} type={"text"}/>
                                                        <FormInput label={"Review description: "}
                                                                   placeholder={"Description"}
                                                                   name={"description"}
                                                                   value={review?.description} type={"text"}/>

                                                        <InputLabel label={"Rating"}></InputLabel>
                                                        <div className="rating flex gap-0.5 mb-4">
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
                                                <button
                                                    className="btn btn-error text-sm hover:underline">Sterge
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-base-content/75 italic">"{review.description}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : ("Produsul nu este gasit")
    );
}