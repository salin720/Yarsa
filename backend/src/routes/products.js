import express from 'express';
import Product from '../models/Product.js';
import { auth, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js'; // ✅ CLOUDINARY UPLOAD

const r = express.Router();

/* ---------------- GET PRODUCTS ---------------- */
r.get('/', async (req, res) => {
    try {
        const {
            category,
            subCategory,
            search,
            sort,
            page = 1,
            limit = 20,
            bestseller,
        } = req.query;

        let q = {};

        if (category) q.category = { $in: String(category).split(',') };
        if (subCategory)
            q.subCategory = { $in: String(subCategory).split(',') };
        if (bestseller) q.bestseller = true;

        if (search) {
            q.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        let s = { createdAt: -1 };
        if (sort === 'low-high') s = { price: 1 };
        if (sort === 'high-low') s = { price: -1 };
        if (sort === 'rating') s = { ratingAvg: -1 };

        const skip = (+page - 1) * +limit;

        const [items, total] = await Promise.all([
            Product.find(q).sort(s).skip(skip).limit(+limit),
            Product.countDocuments(q),
        ]);

        res.json({
            items,
            total,
            page: +page,
            pages: Math.ceil(total / +limit),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ---------------- FEATURED PRODUCTS ---------------- */
r.get('/featured', async (req, res) => {
    try {
        const items = await Product.find({ featured: true }).limit(10);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ---------------- SINGLE PRODUCT ---------------- */
r.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ---------------- CREATE PRODUCT (CLOUDINARY FIXED) ---------------- */
r.post('/', auth, admin, upload.array('images', 4), async (req, res) => {
    try {
        const b = req.body;

        // ✅ Cloudinary gives real URLs here
        const images = (req.files || []).map((file) => file.path);

        const product = await Product.create({
            name: b.name,
            description: b.description,
            price: +b.price,
            category: b.category,
            subCategory: b.subCategory,
            sizes: JSON.parse(b.sizes || '[]'),
            bestseller: b.bestseller === 'true',
            featured: b.featured === 'true',
            stock: +(b.stock || 50),
            images,
        });

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ---------------- UPDATE PRODUCT (CLOUDINARY FIXED) ---------------- */
r.put('/:id', auth, admin, upload.array('images', 4), async (req, res) => {
    try {
        const b = req.body;

        let update = {
            name: b.name,
            description: b.description,
            category: b.category,
            subCategory: b.subCategory,
            bestseller: b.bestseller === 'true',
            featured: b.featured === 'true',
        };

        if (b.sizes) update.sizes = JSON.parse(b.sizes);
        if (b.price) update.price = +b.price;
        if (b.stock) update.stock = +b.stock;

        // ✅ Replace images only if new ones uploaded
        if (req.files && req.files.length > 0) {
            update.images = req.files.map((file) => file.path);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, update, {
            new: true,
        });

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ---------------- DELETE PRODUCT ---------------- */
r.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ---------------- REVIEWS ---------------- */
r.post('/:id/reviews', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const exists = product.reviews.find(
            (r) => String(r.user) === String(req.user._id)
        );

        if (exists) {
            return res
                .status(400)
                .json({ message: 'Already reviewed this product' });
        }

        product.reviews.push({
            user: req.user._id,
            name: req.user.name,
            rating: +req.body.rating,
            comment: req.body.comment,
        });

        product.ratingCount = product.reviews.length;

        product.ratingAvg = +(
            product.reviews.reduce((a, b) => a + b.rating, 0) /
            product.reviews.length
        ).toFixed(1);

        await product.save();

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default r;
