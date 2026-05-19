import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPackage } from 'react-icons/fi';
import { api } from '../services/api.js';
import logo from '../assets/yarsa-logo.jpg';

const getImageUrl = (path) => {
    if (!path) return logo;
    if (path.startsWith('http')) return path;
    return `http://localhost:5001${path}`;
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const load = async (pg = 1, more = false) => {
        try {
            const res = await api.get('/api/orders?page=' + pg + '&limit=20');
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
            await api.put('/api/orders/' + id + '/status', { status: s });
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
                    <div className="order-products">
                        {o.items.map((i, k) => (
                            <div className="admin-order-item" key={k}>
                                <img
                                    src={getImageUrl(i.image)}
                                    alt=""
                                    className="order-product-img"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = logo;
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

                    <div>
                        <p>
                            Items: {o.items.reduce((s, i) => s + i.quantity, 0)}
                        </p>
                        <p>Method: {o.paymentMethod}</p>
                        <p>Payment: {o.payment ? 'Done' : 'Pending'}</p>
                        <p>Date: {new Date(o.date).toLocaleString()}</p>
                        <p>Receipt: {o.receiptNo}</p>
                    </div>

                    <h3>${o.amount}</h3>

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

            {page < pages && (
                <button className="black" onClick={() => load(page + 1, true)}>
                    Load More Orders
                </button>
            )}
        </>
    );
}
