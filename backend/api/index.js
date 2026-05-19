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

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Backend working 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/esewa', esewaRoutes);

// Mongo connect (safe)
let connected = false;

const connectDB = async () => {
    if (connected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        connected = true;
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err.message);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

export default serverless(app);