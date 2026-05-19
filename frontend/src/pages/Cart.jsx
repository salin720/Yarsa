import React from 'react';
import {useNavigate} from 'react-router-dom';
import {FiTrash2} from 'react-icons/fi';
import {img} from '../services/api.js';
import {useStore} from '../context/StoreContext.jsx';

export default function Cart() {
    const {cart, update, remove, total} = useStore();
    const nav = useNavigate();
    return <section><h1 className="page-title">YOUR CART</h1>{cart.map((i, idx) => <div className="cart-row" key={idx}>
        <img src={img(i.image)}/>
        <div><h3>{i.name}</h3><p>Rs{i.price} <span>{i.size}</span></p></div>
        <input type="number" min="1" value={i.quantity} onChange={e => update(idx, e.target.value)}/>
        <button onClick={() => remove(idx)}><FiTrash2/></button>
    </div>)}
        <div className="totals"><h2>CART TOTALS</h2><p>Subtotal <b>Rs{total.toFixed(2)}</b></p><p>Shipping
            Fee <b>Rs10.00</b></p><h3>Total <b>RS{(total + 10).toFixed(2)}</b></h3>
            <button className="black" onClick={() => nav('/checkout')}>PROCEED TO CHECKOUT</button>
        </div>
    </section>
}
