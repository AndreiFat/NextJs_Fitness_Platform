import {createSupabaseServerClient} from "@/utils/supabase/server";
import ModifyQuantityButton from "@/components/shop/buttons/ModifyQuantityButton";
import SubtotalComponent from "@/components/shop/cart/SubtotalComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFaceFrownOpen} from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import React from "react";

export const metadata = {
    title: "Shopping Cart",
    description: "Page for Shopping Cart",
};

export default async function ShoppingCart() {
    const supabase = await createSupabaseServerClient()
    const {data: {user}} = await supabase.auth.getUser();
    const {data: cartProducts, cartError} = await supabase
        .from("cart_products")
        .select(`
            id, 
            quantity, 
            product:products (id, name, price, images, description, stock)`)
        .order('added_at', {ascending: true});
    console.log(cartProducts);
    if (cartError) {
        console.error("Error fetching cart products:", cartError.message);
        return <p>Failed to load cart items.</p>;
    }

    const {data: userAddresses, addressesError} = await supabase
        .from('addresses').select(`
        id,
        city,
        address,
        country`)
        .eq('user_id', user.id);

    if (addressesError) {
        console.error("Error fetching Addresses products:", addressesError.message);
        return <p>Failed to load addresses.</p>;
    }

    function createSubtotalForItem(item) {
        let subtotal = item.quantity * item.product.price;
        return subtotal.toFixed(2) || 0
    }
    
    return (
        <div className="container px-3 sm-px-0 sm:mx-auto pt-32">
            <h1 className="text-4xl font-extrabold text-primary mb-2">Cosul tau de cumparaturi</h1>
            <p className="text-base text-muted-foreground">Verifica produsele selectate si comanda-le cand esti
                pregatit.</p>
            <div className="divider"></div>

            {cartProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                    <p className="text-5xl mb-3"><FontAwesomeIcon icon={faFaceFrownOpen}/></p>
                    <p className="text-lg font-medium">Cosul este gol</p>
                    <p className="text-sm text-base-content/50">Pare ca inca nu ai nimic in cos inca.</p>
                    <Link className={"btn btn-outline btn-primary mt-3"} href={'/shop'}>Shop Now</Link>
                </div>
            ) : (
                <div
                    className={'grid grid-cols-1 md:grid-cols-3 md:gap-4 overflow-hidden'}>
                    <div
                        className="flex flex-col col-span-2 gap-3 overflow-auto h-[calc(100vh-330px)] pr-2">
                        {cartProducts.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="card bg-base-100/75">
                                    <div className="card-body flex flex-row items-top p-4 gap-4">
                                        {Object.keys(item.product.images).length !== 0 ? (
                                            <div
                                                className="h-[100px] w-[100px] bg-cover bg-center rounded-lg"
                                                style={{
                                                    backgroundImage: `url(${item.product.images[0]?.publicUrl})`
                                                }}
                                            ></div>) : (<><img
                                            src={'/file.svg'}
                                            alt={item.product.name}
                                            height={100}
                                            width={100}
                                        /></>)}
                                        <div className={"w-full flex flex-col justify-between"}>
                                            <h3 className={"text-lg font-semibold"}>{item.product.name}</h3>
                                            <div className="flex justify-between items-end w-full">
                                                <ModifyQuantityButton userId={user.id} productId={item.product.id}
                                                                      initialQuantity={item.quantity}
                                                                      stock={item.product.stock}></ModifyQuantityButton>
                                                <div className="text-end">
                                                    <div className="flex items-baseline gap-1">
                                                        <span
                                                            className="text-sm text-base-content/75 ml-1">(incl. TVA)</span>
                                                        <span
                                                            className="text-lg font-extrabold text-base-content/90">RON {item.product.price}</span>
                                                    </div>
                                                    <span
                                                        className="text-2xl font-extrabold text-primary">RON {createSubtotalForItem(item)}</span>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 sm:mt-0">
                        <div className="card bg-base-100/75">
                            <div className="card-body">
                                <SubtotalComponent userEmail={user.email} cartProducts={cartProducts}
                                                   userAddresses={userAddresses}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
