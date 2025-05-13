import formatDate from "@/utils/date/formatDate";
import OrderProducts from "@/components/shop/orders/OrderProducts";
import {faMoneyBillWave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getUserRole} from "@/utils/user/getUserRole";
import button from "daisyui/components/button";
import ModifyStatus from "@/components/shop/orders/admin/ModifyStatus";

export default async function OrderList({orders}) {
    console.log(orders);
    const {is_admin} = await getUserRole();
    return (
        <div>
            <h1></h1>
            {orders.map((order, index) => (
                <div key={index} className="collapse collapse-arrow bg-base-100 border border-base-300 mt-2">
                    <input
                        type="radio"
                        name="my-accordion-2"
                        // defaultChecked={index === 0}
                    />
                    <div className="collapse-title font-semibold d-flex gap-2">
                        <div className="flex align-items-center gap-3 justify-content-between">
                            <span>Comanda #{order.id}</span>
                        </div>
                        <div className={"text-sm font-light text-gray-500"}>
                            {formatDate(order.created_at)}
                        </div>
                    </div>
                    <div className="collapse-content text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="card bg-white rounded-xl border border-gray-200 w-full">
                                <div className="card-body flex justify-between">
                                    <span className="text-gray-600 font-semibold">Ultimul Status</span>
                                    {is_admin ?
                                        <ModifyStatus orderId={order.id} currentStatus={order.status}
                                                      existingTrackingId={order.tracking_id}></ModifyStatus> :
                                        <span
                                            className="text-2xl font-semibold text-primary capitalize"><FontAwesomeIcon
                                            icon={faMoneyBillWave} className={"me-2"}/>{order.status}</span>}
                                    <span
                                        className={"text-gray-400 text-xs"}>Modificat la: {formatDate(order.created_at)}</span>
                                </div>
                            </div>
                            <div className="col-span-3 card bg-white rounded-xl border border-gray-200 w-full">
                                <div className="card-body flex md:flex-row justify-between gap-5">
                                    <div id="invoice-address">
                                        <p className="text-gray-600 text-sm">Adresa de facturare</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.address.address},
                                            {order.address.city},
                                            {order.address.country}</p>
                                        {order.is_invoice_generated ?
                                            <button className={"btn btn-outline btn-accent mt-3"}>Download
                                                Invoice</button> : <></>}
                                    </div>
                                    <div id="delivery-address">
                                        <p className="text-gray-600 text-sm">Adresa de livrare</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.address.address},
                                            {order.address.city},
                                            {order.address.country} </p>
                                        {order.tracking_id ? <span className="badge">{order.tracking_id}</span> : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="divider my-2"></div>
                        <OrderProducts orderId={order.id}></OrderProducts>
                        <div className="divider my-2"></div>

                        <div className="card bg-white shadow-sm rounded-xl border border-gray-200 w-full">
                            <div className="card-body flex justify-between items-end">
                                <span className="text-gray-600 text-sm">Subtotal</span>
                                <span className="text-lg font-semibold text-gray-800">
                                {order.total_price} RON
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
