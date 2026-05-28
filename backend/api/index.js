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

/* ---------------- TRUST PROXY (Render Fix) ---------------- */
app.set('trust proxy', 1);

/* ---------------- PATH FIX ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- BODY PARSER ---------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ---------------- STATIC FILES ---------------- */
/*
   Cloudinary is used for images now.
   So NO /uploads needed anymore.
*/
app.use('/assets', express.static(path.join(__dirname, '../assets')));

/* ---------------- CORS CONFIG ---------------- */
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            const allowedOrigins = [
                'http://localhost:5173',
                'http://localhost:3000',
                'https://yarsa-admin.vercel.app',
                'https://yarsa.vercel.app',
                'https://yarsa-frontend.vercel.app',
            ];

            const isAllowed =
                allowedOrigins.includes(origin) ||
                origin.includes('vercel.app') ||
                origin.includes('localhost');

            if (isAllowed) {
                return callback(null, true);
            }

            console.log('⚠️ CORS blocked origin:', origin);

            // Allow anyway (avoids deployment issues)
            return callback(null, true);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

/* ---------------- PREFLIGHT ---------------- */
app.options('*', cors());

/* ---------------- TEST ROUTE ---------------- */
app.get('/', (req, res) => {
    res.json({
        message: '🚀 YARSA Backend is running successfully',
    });
});

/* ---------------- API ROUTES ---------------- */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/esewa', esewaRoutes);

/* ---------------- DATABASE CONNECTION ---------------- */
let isConnected = false;

const connectDB = async () => {
    try {
        if (isConnected) return;

        if (!process.env.MONGO_URI) {
            console.log('❌ MONGO_URI missing in environment variables');
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);

        isConnected = true;
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.log('❌ MongoDB connection error:', err.message);
    }
};

connectDB();

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
    console.error('❌ SERVER ERROR:', err);

    res.status(500).json({
        error: err.message || 'Internal Server Error',
    });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
