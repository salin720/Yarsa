import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
    try {
        const h = req.headers.authorization || '';
        const token = h.startsWith('Bearer ') ? h.slice(7) : '';
        if (!token) return res.status(401).json({ message: 'No token' });
        const d = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(d.id).select('-password');
        if (!req.user)
            return res.status(401).json({ message: 'Invalid token' });
        next();
    } catch (e) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
export const admin = (req, res, next) =>
    req.user?.role === 'admin'
        ? next()
        : res.status(403).json({ message: 'Admin only' });
