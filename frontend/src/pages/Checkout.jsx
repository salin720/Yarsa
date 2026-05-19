import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {api} from '../services/api.js';
import {useStore} from '../context/StoreContext.jsx';

export default function Checkout() {
    const {cart, total, clear, user} = useStore();
    const [method, setMethod] = useState('COD');
    const nav = useNavigate();

    const redirectToEsewa = async () => {
        try {
            const orderId = 'YARSA-' + Date.now();

            const res = await api.post('/api/esewa/initiate', {
                amount: total + 10,
                orderId
            });

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

            Object.entries(res.data).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            console.log(err);
            toast.error('Could not redirect to eSewa');
        }
    };

    async function submit(e) {
        e.preventDefault();

        if (!user || !localStorage.getItem('token')) {
            toast.error('Please login before checkout');
            nav('/login');
            return;
        }

        if (!cart.length) {
            toast.error('Your cart is empty');
            return;
        }

        const address = Object.fromEntries(new FormData(e.currentTarget));

        try {
            if (method === 'Esewa') {
                await redirectToEsewa();
                return;
            }

            const r = await api.post('/api/orders', {
                items: cart,
                address,
                paymentMethod: method,
                paymentId: ''
            });

            toast.success('Order placed successfully');
            clear();
            nav('/receipt/' + r.data._id);
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                nav('/login');
            } else {
                toast.error(err.response?.data?.message || 'Order failed');
            }
        }
    }

    return (
        <section className="checkout pro-checkout">
            <form onSubmit={submit} className="checkout-form">
                <h1 className="page-title">DELIVERY INFORMATION</h1>

                <div className="two">
                    <input name="firstName" placeholder="First name" required/>
                    <input name="lastName" placeholder="Last name" required/>
                </div>

                <input
                    name="email"
                    placeholder="Email address"
                    defaultValue={user?.email || ''}
                    required
                />

                <input name="street" placeholder="Street" required/>

                <div className="two">
                    <input name="city" placeholder="City" required/>
                    <input name="state" placeholder="State"/>
                </div>

                <div className="two">
                    <input name="zipcode" placeholder="Zipcode"/>
                    <input name="country" placeholder="Country" defaultValue="Nepal"/>
                </div>

                <input name="phone" placeholder="Phone" required/>
            </form>

            <aside className="totals checkout-card">
                <h2>CART TOTALS</h2>

                <p>
                    Subtotal <b>Rs{total.toFixed(2)}</b>
                </p>

                <p>
                    Shipping Fee <b>Rs10.00</b>
                </p>

                <h3>
                    Total <b>Rs{(total + 10).toFixed(2)}</b>
                </h3>

                <h2>PAYMENT METHOD</h2>

                <div className="pay">
                    <button
                        type="button"
                        className={method === 'Esewa' ? 'active' : ''}
                        onClick={() => setMethod('Esewa')}
                    >
                        eSewa
                    </button>

                    <button
                        type="button"
                        className={method === 'COD' ? 'active' : ''}
                        onClick={() => setMethod('COD')}
                    >
                        Cash on Delivery
                    </button>
                </div>

                <small className="payment-note">
                    You will be redirected to eSewa test payment page.
                </small>

                <button
                    className="black"
                    onClick={() => document.querySelector('.checkout form').requestSubmit()}
                >
                    PLACE ORDER
                </button>
            </aside>
        </section>
    );
}