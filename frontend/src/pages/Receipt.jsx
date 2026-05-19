import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function Receipt() {
    const { id } = useParams();
    const [o, setO] = useState(null);
    useEffect(() => {
        api.get('/api/orders/' + id + '/receipt').then((r) => setO(r.data));
    }, [id]);
    if (!o) return null;
    return (
        <section className="receipt">
            <h1>YARSA Receipt</h1>
            <p>
                <b>Receipt:</b> {o.receiptNo}
            </p>
            <p>
                <b>Date:</b> {new Date(o.date).toLocaleString()}
            </p>
            <p>
                <b>Payment:</b> {o.paymentMethod}{' '}
                {o.paymentId && '(' + o.paymentId + ')'}
            </p>
            <table>
                <tbody>
                    {o.items.map((i, k) => (
                        <tr key={k}>
                            <td>
                                {i.name} ({i.size}) x {i.quantity}
                            </td>
                            <td>Rs {i.price * i.quantity}</td>
                        </tr>
                    ))}
                    <tr>
                        <th>Total</th>
                        <th>Rs {o.amount}</th>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => print()} className="black">
                Print Receipt
            </button>
        </section>
    );
}
