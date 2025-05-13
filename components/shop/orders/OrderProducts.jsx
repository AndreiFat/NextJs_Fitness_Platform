import {createSupabaseServerClient} from "@/utils/supabase/server";
import Link from "next/link";

export default async function OrderProducts({orderId}) {
    const supabase = await createSupabaseServerClient();
    let {data: orderProducts, error} = await supabase
        .from('order_products')
        .select(`
            quantity,
            product_price,
            product:products (id, name, images)
        `).eq("order_id", orderId)
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    <tbody>
                    {orderProducts.map(
                        (item, index) =>
                            (<tr key={index}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                {Object.keys(item.product.images).length !== 0 ? (
                                                    <img
                                                        src={item.product.images[0].publicUrl || '/file.svg'}
                                                        alt={item.product.name}
                                                    />) : (<><img
                                                    src={'/file.svg'}
                                                    alt={item.product.name}
                                                /></>)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{item.product.name}</div>
                                            <div className="text-sm opacity-50">#{item.product.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    Price
                                    <br/>
                                    <span className="badge badge-ghost badge-sm">{item.product_price} RON</span>
                                </td>
                                <td>
                                    Quantity
                                    <br/>
                                    <span className="badge badge-ghost badge-sm">{item.quantity} Buc</span>
                                </td>
                                <th>
                                    <Link href={`/shop/product/${item.product.id}`}
                                          className="btn btn-ghost btn-xs">details</Link>
                                </th>
                            </tr>))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
