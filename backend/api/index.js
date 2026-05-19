import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from '../src/routes/auth.js';
import productRoutes from '../src/routes/products.js';
import orderRoutes from '../src/routes/orders.js';
import dashboardRoutes from '../src/routes/dashboard.js';
import esewaRoutes from '../src/routes/esewa.js';

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({origin: '*', credentials: true}));
app.use(express.json());

/* ---------------- TEST ROUTE ---------------- */
app.get('/', (req, res) => {
    res.json({message: 'Backend working 🚀'});
});

/* ---------------- ROUTES ---------------- */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/esewa', esewaRoutes);

/* ---------------- MONGODB CONNECTION ---------------- */
let isConnected = false;

const connectDB = async () => {
    try {
        if (isConnected) return;

        if (!process.env.MONGO_URI) {
            console.log('❌ MONGO_URI is missing in environment variables');
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);

        isConnected = true;
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.log('❌ MongoDB error:', err.message);
    }
};

/* Connect once on startup */
connectDB();

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({error: 'Server crashed'});
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});