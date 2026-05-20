import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api, img } from '../services/api.js';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const load = async (pg = 1, more = false) => {
        try {
            const res = await api.get(`/api/orders?page=${pg}&limit=20`);

            setOrders((prev) =>
                more ? [...prev, ...res.data.items] : res.data.items
            );

            setPage(pg);
            setPages(res.data.pages);
        } catch (err) {
            console.log(err);
            toast.error('Failed to load orders');
        }
    };

    useEffect(() => {
        load();
    }, []);

    async function status(id, s) {
        try {
            await api.put(`/api/orders/${id}/status`, {
                status: s,
            });

            toast.success('Order status updated');
            load();
        } catch (err) {
            console.log(err);
            toast.error('Failed to update status');
        }
    }

    return (
        <>
            <h1>Order Page</h1>

            {orders.map((o) => (
                <div className="order admin-order" key={o._id}>
                    {/* PRODUCTS SECTION */}
                    <div className="order-products">
                        {o.items?.map((i, k) => (
                            <div className="admin-order-item" key={k}>
                                <img
                                    src={img(i.image)}
                                    alt={i.name || 'product'}
                                    className="order-product-img"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src =
                                            '/assets/frontend_assets/p_img1.png';
                                    }}
                                />

                                <div>
                                    <b>{i.name}</b>
                                    <p>
                                        Qty: {i.quantity} | Size: {i.size}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <b>
                            {o.address?.firstName} {o.address?.lastName}
                        </b>

                        <p>
                            {o.address?.street}, {o.address?.city}
                            <br />
                            {o.address?.phone}
                        </p>
                    </div>

                    {/* ORDER DETAILS */}
                    <div>
                        <p>
                            Items:{' '}
                            {o.items?.reduce(
                                (s, i) => s + (i.quantity || 0),
                                0
                            )}
                        </p>

                        <p>Method: {o.paymentMethod}</p>

                        <p>Payment: {o.payment ? 'Done' : 'Pending'}</p>

                        <p>
                            Date:{' '}
                            {o.date ? new Date(o.date).toLocaleString() : 'N/A'}
                        </p>

                        <p>Receipt: {o.receiptNo || 'N/A'}</p>
                    </div>

                    <h3>Rs {o.amount}</h3>

                    {/* STATUS CONTROL */}
                    <select
                        value={o.status}
                        onChange={(e) => status(o._id, e.target.value)}
                    >
                        <option>Order Placed</option>
                        <option>Packing</option>
                        <option>Shipped</option>
                        <option>Out for delivery</option>
                        <option>Delivered</option>
                    </select>
                </div>
            ))}

            {/* PAGINATION */}
            {page < pages && (
                <button className="black" onClick={() => load(page + 1, true)}>
                    Load More Orders
                </button>
            )}
        </>
    );
}
