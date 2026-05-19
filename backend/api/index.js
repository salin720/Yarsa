import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import serverless from 'serverless-http';

import authRoutes from '../src/routes/auth.js';
import productRoutes from '../src/routes/products.js';
import orderRoutes from '../src/routes/orders.js';
import dashboardRoutes from '../src/routes/dashboard.js';
import esewaRoutes from '../src/routes/esewa.js';

dotenv.config();

const app = express();

/* ---------------- CORS ---------------- */
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

/* ---------------- TEST ROUTE ---------------- */
app.get('/', (req, res) => {
    res.json({ message: 'Backend working 🚀' });
});

/* ---------------- ROUTES ---------------- */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/esewa', esewaRoutes);

/* ---------------- SAFE MONGO CONNECT ---------------- */
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('MongoDB connected');
    } catch (err) {
        console.log('Mongo Error:', err.message);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server crashed' });
});

/* ---------------- EXPORT ---------------- */
export default serverless(app);