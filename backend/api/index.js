import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

/* ---------------- ROUTES ---------------- */
import authRoutes from '../src/routes/auth.js';
import productRoutes from '../src/routes/products.js';
import orderRoutes from '../src/routes/orders.js';
import dashboardRoutes from '../src/routes/dashboard.js';
import esewaRoutes from '../src/routes/esewa.js';

dotenv.config();

const app = express();

/* ---------------- REQUIRED FOR RENDER ---------------- */
app.set('trust proxy', 1);

/* ---------------- DIR FIX ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- BODY ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- STATIC FILES ---------------- */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

/* ---------------- CORS (FINAL FIX - IMPORTANT) ---------------- */
const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://localhost:3000',
    'https://yarsa-admin.vercel.app',
    'https://yarsa.vercel.app',
    'https://yarsa-frontend.vercel.app',
]);

app.use(
    cors({
        origin: (origin, callback) => {
            // allow server-to-server / render health checks
            if (!origin) return callback(null, true);

            if (allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            console.log('❌ Blocked by CORS:', origin);
            return callback(null, false);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204,
    })
);

/* ---------------- IMPORTANT: HANDLE PREFLIGHT ---------------- */
app.options('*', cors());

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

/* ---------------- DB ---------------- */
let isConnected = false;

const connectDB = async () => {
    try {
        if (isConnected) return;

        if (!process.env.MONGO_URI) {
            console.log('❌ MONGO_URI missing');
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);

        isConnected = true;
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.log('❌ MongoDB error:', err.message);
    }
};

connectDB();

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({
        error: err.message || 'Server crashed',
    });
});

/* ---------------- START ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
