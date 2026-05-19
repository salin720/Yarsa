import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';
import {auth, admin} from '../middleware/auth.js';

const upload = multer({
    storage: multer.memoryStorage()
});

const r = express.Router();

/* ---------------- GET PRODUCTS ---------------- */
r.get('/', async (req, res) => {
    const {
        category,
        subCategory,
        search,
        sort,
        page = 1,
        limit = 20,
        bestseller
    } = req.query;

    let q = {};

    if (category) q.category = {$in: String(category).split(',')};
    if (subCategory) q.subCategory = {$in: String(subCategory).split(',')};
    if (bestseller) q.bestseller = true;

    if (search) {
        q.$or = [
            {name: {$regex: search, $options: 'i'}},
            {description: {$regex: search, $options: 'i'}}
        ];
    }

    let s = {createdAt: -1};
    if (sort === 'low-high') s = {price: 1};
    if (sort === 'high-low') s = {price: -1};
    if (sort === 'rating') s = {ratingAvg: -1};

    const skip = (+page - 1) * (+limit);

    const [items, total] = await Promise.all([
        Product.find(q).sort(s).skip(skip).limit(+limit),
        Product.countDocuments(q)
    ]);

    res.json({
        items,
        total,
        page: +page,
        pages: Math.ceil(total / (+limit))
    });
});

/* ---------------- FEATURED ---------------- */
r.get('/featured', async (req, res) => {
    const items = await Product.find({featured: true}).limit(10);
    res.json(items);
});

/* ---------------- GET SINGLE ---------------- */
r.get('/:id', async (req, res) => {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({message: 'Product not found'});
    res.json(p);
});

/* ---------------- CREATE PRODUCT ---------------- */
r.post('/', auth, admin, upload.array('images', 4), async (req, res) => {
    const b = req.body;

    // TEMP: memory storage (no file saving)
    const uploaded = (req.files || []).map(file => ({
        name: file.originalname,
        type: file.mimetype,
        size: file.size
    }));

    const product = await Product.create({
        name: b.name,
        description: b.description,
        price: +b.price,
        category: b.category,
        subCategory: b.subCategory,
        sizes: JSON.parse(b.sizes || '[]'),
        bestseller: b.bestseller === 'true' || b.bestseller === true,
        featured: b.featured === 'true' || b.featured === true,
        stock: +(b.stock || 50),

        // TEMP FIX (no filesystem usage)
        images: uploaded.length ? uploaded : JSON.parse(b.images || '[]')
    });

    res.json(product);
});

/* ---------------- UPDATE PRODUCT ---------------- */
r.put('/:id', auth, admin, upload.array('images', 4), async (req, res) => {
    const b = req.body;
    let update = {...b};

    if (b.sizes) update.sizes = JSON.parse(b.sizes);
    if (b.price) update.price = +b.price;
    if (b.stock) update.stock = +b.stock;

    // TEMP FIX
    if (req.files?.length) {
        update.images = req.files.map(file => ({
            name: file.originalname,
            type: file.mimetype,
            size: file.size
        }));
    }

    const p = await Product.findByIdAndUpdate(req.params.id, update, {new: true});

    res.json(p);
});

/* ---------------- DELETE ---------------- */
r.delete('/:id', auth, admin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({message: 'Product deleted'});
});

/* ---------------- REVIEWS ---------------- */
r.post('/:id/reviews', auth, async (req, res) => {
    const p = await Product.findById(req.params.id);

    if (!p)
        return res.status(404).json({message: 'Product not found'});

    const exists = p.reviews.find(
        x => String(x.user) === String(req.user._id)
    );

    if (exists)
        return res.status(400).json({message: 'You already reviewed this product'});

    p.reviews.push({
        user: req.user._id,
        name: req.user.name,
        rating: +req.body.rating,
        comment: req.body.comment
    });

    p.ratingCount = p.reviews.length;
    p.ratingAvg = +(
        p.reviews.reduce((a, b) => a + b.rating, 0) / p.reviews.length
    ).toFixed(1);

    await p.save();

    res.json(p);
});

export default r;