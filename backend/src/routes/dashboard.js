import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import {auth, admin} from '../middleware/auth.js';

const r = express.Router();
r.get('/', auth, admin, async (req, res) => {
    const [products, orders, users] = await Promise.all([Product.countDocuments(), Order.find(), User.countDocuments({role: 'user'})]);
    const revenue = orders.reduce((s, o) => s + (o.payment ? o.amount : 0), 0);
    const status = orders.reduce((a, o) => {
        a[o.status] = (a[o.status] || 0) + 1;
        return a
    }, {});
    const recent = orders.slice(-7).map(o => ({date: o.createdAt.toISOString().slice(0, 10), amount: o.amount}));
    res.json({products, orders: orders.length, users, revenue, status, recent})
});
export default r;
