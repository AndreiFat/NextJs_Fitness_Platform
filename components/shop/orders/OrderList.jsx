import formatDate from "@/utils/date/formatDate";
import OrderProducts from "@/components/shop/orders/OrderProducts";
import {faMoneyBillWave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getUserRole} from "@/utils/user/getUserRole";
import ModifyStatus from "@/components/shop/orders/admin/ModifyStatus";
import DownloadInvoiceButton from "@/components/shop/orders/DownloadInvoiceButton";

export default async function OrderList({orders}) {
    const {is_admin} = await getUserRole();
    return (
        <div>
            <h1 className="text-3xl font-bold mb-3 text-primary text-center">Lista Comenzi</h1>
            <p className="text-base-content/70 text-sm text-center mb-6">
                {is_admin ? ("Panoul de administrare pentru toate comenzile înregistrate pe platformă.") : ("Accesează detalii complete despre comenzile tale și starea livrării.")}
            </p>
            {orders.length > 0 ? (orders.map((order, index) => (
                <div
                    key={index}
                    className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl shadow-sm md:mt-2 mt-1"
                >
                    <input type="radio" name="my-accordion-2"/>
                    <div
                        className="collapse-title flex justify-between items-center font-semibold text-lg text-base-content cursor-pointer">
                        <div className="flex items-center gap-3">
                            <span>Comanda #{order.id}</span>
                            <span
                                className={`badge ${
                                    order.status === 'completed' ? 'badge-success' : 'badge-accent badge-soft'
                                }`}
                            >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
                        </div>
                        <div className="text-sm font-light text-base-content/60">
                            {formatDate(order.created_at)}
                        </div>
                    </div>

                    <div className="collapse-content space-y-6 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <div className="card rounded-xl border border-base-content/20 shadow-sm w-full">
                                <div className="card-body flex flex-col gap-1">
              <span className="font-semibold text-base-content/80">
                Ultimul Status
              </span>
                                    {is_admin ? (
                                        <ModifyStatus
                                            orderId={order.id}
                                            currentStatus={order.status}
                                            existingTrackingId={order.tracking_id}
                                        />
                                    ) : (
                                        <span
                                            className="text-xl font-semibold text-primary capitalize flex items-center gap-2">
                  <FontAwesomeIcon icon={faMoneyBillWave}/>
                                            {order.status}
                </span>
                                    )}
                                    <span className="text-xs text-base-content/50">
                Modificat la: {formatDate(order.created_at)}
              </span>
                                </div>
                            </div>

                            <div className="col-span-3 card rounded-xl border border-base-content/20 shadow-sm w-full">
                                <div className="card-body flex flex-col md:flex-row justify-between gap-6">
                                    <div id="user-details" className="min-w-[180px]">
                                        <p className="text-base-content/60 mb-1 font-medium">
                                            Detalii utilizator
                                        </p>
                                        <p className="font-semibold leading-tight">
                                            {order.user.full_name && <>{order.user.full_name}<br/></>}
                                            {order.user.email && <>{order.user.email}<br/></>}
                                            {order.user.phone && <>{order.user.phone}</>}
                                        </p>
                                    </div>

                                    <div id="invoice-address" className="min-w-[180px]">
                                        <p className="text-base-content/60 mb-1 font-medium">
                                            Adresa de facturare
                                        </p>
                                        <p className="font-semibold leading-tight">
                                            {order.address.address}, {order.address.city}, {order.address.country}
                                        </p>
                                        {order.is_invoice_generated && (
                                            <DownloadInvoiceButton filePath={order.invoice_url} orderId={order.id}/>
                                        )}
                                    </div>

                                    <div id="delivery-address" className="min-w-[180px]">
                                        <p className="text-base-content/60 mb-1 font-medium">
                                            Adresa de livrare
                                        </p>
                                        <p className="font-semibold leading-tight">
                                            {order.address.address}, {order.address.city}, {order.address.country}
                                        </p>
                                        {order.tracking_id && (
                                            <span
                                                className="badge badge-lg text-sm badge-soft badge-info mt-2">{order.tracking_id}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <OrderProducts orderId={order.id}/>

                        <div className="divider"></div>

                        <div className="card rounded-xl border border-base-content/20 shadow-sm w-full">
                            <div className="card-body flex justify-between items-end">
                                <span className="text-base-content/60 font-medium text-sm">Subtotal</span>
                                <span className="text-lg font-semibold">{order.total_price} RON</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))) : (
                <>
                    <div className="divider"></div>
                    <div className="text-center">
                        Nu sunt comenzi inca.
                    </div>
                </>
            )}
        </div>
    );
}
