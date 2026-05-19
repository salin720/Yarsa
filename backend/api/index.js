import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import serverless from 'serverless-http';

// Routes
import authRoutes from '../src/routes/auth.js';
import productRoutes from '../src/routes/products.js';
import orderRoutes from '../src/routes/orders.js';
import dashboardRoutes from '../src/routes/dashboard.js';
import esewaRoutes from '../src/routes/esewa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

/* ---------------- CORS ---------------- */
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
].filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);

app.use(express.json({ limit: '10mb' }));

/* ---------------- Static Files ---------------- */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* ---------------- Test Route ---------------- */
app.get('/', (req, res) => {
    res.json({ message: 'YARSA MERN backend running' });
});

/* ---------------- API Routes ---------------- */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/esewa', esewaRoutes);

/* ---------------- MongoDB ---------------- */
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB connected');
        }
    } catch (error) {
        console.error('MongoDB Error:', error.message);
    }
};

connectDB();

/* ---------------- VERCEL EXPORT ---------------- */
export default serverless(app);