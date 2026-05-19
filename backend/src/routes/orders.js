import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { auth, admin } from '../middleware/auth.js';

const r = express.Router();
const receipt = () => `YARSA-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
r.post('/', auth, async (req, res) => {
    const { items, address, paymentMethod = 'COD' } = req.body;
    if (!items?.length)
        return res.status(400).json({ message: 'Cart is empty' });
    let amount = 10;
    const clean = [];
    for (const it of items) {
        const p = await Product.findById(it.product);
        if (!p) continue;
        amount += p.price * it.quantity;
        clean.push({
            product: p._id,
            name: p.name,
            image: p.images?.[0],
            size: it.size,
            quantity: it.quantity,
            price: p.price,
        });
    }
    const order = await Order.create({
        user: req.user._id,
        items: clean,
        address,
        amount,
        paymentMethod,
        payment: paymentMethod === 'COD' ? false : true,
        receiptNo: receipt(),
        paymentId: paymentMethod === 'Esewa' ? `ESEWA-DEMO-${Date.now()}` : '',
    });
    res.json(order);
});
r.post('/esewa/init', auth, async (req, res) => {
    res.json({
        message:
            'Demo eSewa/DomiPay initialized. Replace credentials and endpoint in production.',
        paymentUrl: '/payment-success',
        transactionId: `ESEWA-DEMO-${Date.now()}`,
    });
});
r.get('/my', auth, async (req, res) =>
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }))
);
r.get('/', auth, admin, async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (+page - 1) * +limit;
    const [items, total] = await Promise.all([
        Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(+limit),
        Order.countDocuments(),
    ]);
    res.json({ items, total, page: +page, pages: Math.ceil(total / +limit) });
});
r.put('/:id/status', auth, admin, async (req, res) =>
    res.json(
        await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )
    )
);
r.get('/:id/receipt', auth, async (req, res) => {
    const o = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );
    if (!o) return res.status(404).json({ message: 'Order not found' });
    if (
        req.user.role !== 'admin' &&
        String(o.user._id) !== String(req.user._id)
    )
        return res.status(403).json({ message: 'Forbidden' });
    res.json(o);
});
export default r;
