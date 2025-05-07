import {createSupabaseServerClient} from "@/utils/supabase/server";
import ModifyQuantityButton from "@/components/shop/buttons/ModifyQuantityButton";
import SubtotalComponent from "@/components/shop/cart/SubtotalComponent";

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
            product:products (id, name, price, images, description)`)
        .order('added_at', {ascending: true});

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

    console.log(cartProducts)
    console.log(userAddresses)


    return (
        <div className="container px-3 sm-px-0 sm:mx-auto">
            <h1>Shopping Cart</h1>
            <p>This is the Shopping Cart page.</p>
            {cartProducts.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div
                    className={'grid grid-cols-1 md:grid-cols-3 md:gap-4'}>
                    <div className="grid grid-cols-1 col-span-2 gap-3 items-stretch">
                        {cartProducts.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="card card-border bg-base-100">
                                    <div className="card-body flex flex-row items-top p-5 gap-4">
                                        {Object.keys(item.product.images).length !== 0 ? (
                                            <div>
                                                <img
                                                    src={item.product.images[0].publicUrl || '/file.svg'}
                                                    alt={item.product.name}
                                                    height={84}
                                                    width={84}
                                                /></div>) : (<><img
                                            src={'/file.svg'}
                                            alt={item.product.name}
                                            height={84}
                                            width={84}
                                        /></>)}
                                        <div>
                                            <h3>{item.product.name}</h3>
                                            <div className="">
                                                <p>Price: {item.product.price} RON</p>
                                                <pre>Subtotal: {createSubtotalForItem(item)} RON</pre>
                                                <ModifyQuantityButton userId={user.id} productId={item.product.id}
                                                                      initialQuantity={item.quantity}></ModifyQuantityButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 sm:mt-0">
                        <div className="card card-border">
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
