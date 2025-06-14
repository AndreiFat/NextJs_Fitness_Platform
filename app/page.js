import Homepage from "@/app/(homepage)/Homepage";
import {createSupabaseServerClient} from "@/utils/supabase/server";

export default async function Home() {
    const supabase = await createSupabaseServerClient();


    let {data: products, error} = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .range(0, 3)

    return (
        <div>
            <Homepage products={products} error={error}/>
        </div>
    )
}
