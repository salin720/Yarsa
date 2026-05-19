import React, { useEffect, useState } from 'react';
import {
    FiDollarSign,
    FiPackage,
    FiShoppingBag,
    FiUsers,
} from 'react-icons/fi';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api.js';

export default function Dashboard() {
    const [d, setD] = useState(null);
    useEffect(() => {
        api.get('/api/dashboard').then((r) => setD(r.data));
    }, []);
    if (!d) return <p>Loading dashboard...</p>;
    return (
        <>
            <h1>Dashboard Analytics</h1>
            <div className="stats">
                <article>
                    <FiCreditCard />
                    <span>Revenue</span>
                    <b>Rs {d.revenue}</b>
                </article>
                <article>
                    <FiShoppingBag />
                    <span>Orders</span>
                    <b>{d.orders}</b>
                </article>
                <article>
                    <FiPackage />
                    <span>Products</span>
                    <b>{d.products}</b>
                </article>
                <article>
                    <FiUsers />
                    <span>Customers</span>
                    <b>{d.users}</b>
                </article>
            </div>
            <div className="panel">
                <h2>Recent Sales</h2>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={d.recent}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#c71221"
                            fill="#ffe4e7"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="panel">
                <h2>Order Status</h2>
                {Object.entries(d.status || {}).map(([k, v]) => (
                    <p className="status" key={k}>
                        <span>{k}</span>
                        <b>{v}</b>
                    </p>
                ))}
            </div>
        </>
    );
}
