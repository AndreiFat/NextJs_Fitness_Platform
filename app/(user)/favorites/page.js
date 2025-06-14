import FavoriteProducts from "@/app/(user)/favorites/products/FavoriteProducts";
import FavoriteRecipes from "@/app/(user)/favorites/recipes/FavoriteRecipes";
import FavoriteExercises from "@/app/(user)/favorites/exercises/FavoriteExercises";
import {faCookie, faDumbbell, faStore} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME} — Favorite`,
    description: "Page for Favorites",
};

export default async function Favorites() {
    const supabase = await createSupabaseServerClient()
    const {data: {user}, error} = await supabase.auth.getUser();

    const {data: products, count: productCount, error: productError} = await supabase
        .from('favorites')
        .select('product_id, products(*)', {count: 'exact'})
        .eq('user_id', user.id);

    const {data: meals, count: mealCount, error: mealError} = await supabase
        .from('ai_favorite_items')
        .select('item, item_hash', {count: 'exact'})
        .eq('user_id', user.id)
        .eq('type', 'meal');

    const {data: workouts, count: workoutCount, error: workoutError} = await supabase
        .from('ai_favorite_items')
        .select('item, item_hash', {count: 'exact'})
        .eq('user_id', user.id)
        .eq('type', 'workout');

    if (productError) {
        console.error("Error loading favorite products:", error);
    }

    if (mealError) {
        console.error("Error loading favorite meals:", error);
    }

    if (workoutError) {
        console.error("Error loading favorite workouts:", error);
    }

    return (
        <div className="container mx-auto p-4 sm:px-0 sm: py-4 pt-32">
            <div className="tabs tabs-lift">
                <label className="tab gap-2">
                    <input type="radio" name="my_tabs_4" defaultChecked/>
                    <FontAwesomeIcon size={"lg"} icon={faStore}/>
                    Produse
                    <div className="badge badge-soft badge-primary">{productCount}</div>

                </label>
                <div className="tab-content bg-base-200/75 border-base-300 p-6">
                    <FavoriteProducts userId={user.id} products={products}></FavoriteProducts>
                </div>

                <label className="tab gap-2">
                    <input type="radio" name="my_tabs_4"/>
                    <FontAwesomeIcon size={"lg"} icon={faCookie}/>
                    Retete
                    <div className="badge badge-soft badge-primary">{mealCount}</div>

                </label>
                <div className="tab-content bg-base-200/75 border-base-300 p-6">
                    <FavoriteRecipes recipes={meals}/>
                </div>

                <label className="tab gap-2">
                    <input type="radio" name="my_tabs_4"/>
                    <FontAwesomeIcon size={"lg"} icon={faDumbbell}/>
                    Exercitii
                    <div className="badge badge-soft badge-primary">{workoutCount}</div>

                </label>
                <div className="tab-content bg-base-200/75 border-base-300 p-6">
                    <FavoriteExercises workouts={workouts}></FavoriteExercises>
                </div>
            </div>
        </div>
    );
}
