import UserInfo from "@/components/auth/UserInfo";
import {createSupabaseServerClient} from "@/utils/supabase/server";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping, faHeart} from "@fortawesome/free-solid-svg-icons";

async function NavbarComponent() {
    const supabase = await createSupabaseServerClient();
    const {data: {user}, error} = await supabase.auth.getUser();

    let numberOfItems = 0;
    let totalProductsInCart = 0;
    if (user) {
        let {data: ai_favorite_items, count: countAI, error: errorAI} = await supabase
            .from('ai_favorite_items')
            .select('id', {count: 'exact'})
            .eq('user_id', user.id);

        let {data: favorites, count: countProducts, error: errorProducts} = await supabase
            .from('favorites')
            .select('*', {count: 'exact'})
            .eq('user_id', user.id);

        let {data: cartProducts, count: countCartProducts, error: errorCartProducts} = await supabase
            .from('cart_products')
            .select('quantity', {count: 'exact'})
            .eq('user_id', user.id);


        numberOfItems = countAI + countProducts;
        totalProductsInCart = cartProducts?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    }
    return (
        <div className="navbar z-50 fixed top-0 shadow-sm align-center h-[76px] bg-base-100/75 backdrop-blur-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h7"/>
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><a href={"/"}>Homepage</a></li>
                        <li><a href={"/shop"}>Shop</a></li>
                        <li><a href={"/fitness"}>Fitness</a></li>
                        <li><a href={"/community"}>Community</a></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center w-50">
                <a className="" href={"/"}><img src="/assets/logo.png" className={"h-[42px]"}
                                                alt=""/></a>
            </div>
            <div className="navbar-end flex gap-2">
                {/*<button className="btn btn-ghost btn-circle">*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"*/}
                {/*         stroke="currentColor">*/}
                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
                {/*              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}
                <Link href={"/shop/shopping-cart"} className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <FontAwesomeIcon icon={faCartShopping} size={"xl"}></FontAwesomeIcon>
                        {totalProductsInCart > 0 ? <span
                            className="badge badge-xs px-1.5 badge-primary indicator-item">{totalProductsInCart}</span> : <></>}
                    </div>
                </Link>
                <Link href={"/favorites"} className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <FontAwesomeIcon icon={faHeart} size={"xl"}></FontAwesomeIcon>
                        {numberOfItems > 0 ? <span
                            className="badge badge-xs px-1.5 badge-accent indicator-item">{numberOfItems}</span> : <></>}
                    </div>
                </Link>
                {user != null ? (<UserInfo userInfo={user}/>) : (<div className="flex gap-2">
                    <Link className={"btn btn-soft"} href={"/login"}>Login</Link>
                    <Link className={"btn btn-soft btn-secondary"} href={"/signup"}>Sign Up</Link>
                </div>)}
            </div>
        </div>
    );
}

export default NavbarComponent;