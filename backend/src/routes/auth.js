import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {token} from '../utils/token.js';
import {auth} from '../middleware/auth.js';

const r = express.Router();

r.post('/register', async (req, res) => {
    const {name, email, password, phone, address} = req.body;

    if (!name || !email || !password || !phone || !address) {
        return res.status(400).json({message: 'All fields required'});
    }

    if (await User.findOne({email})) {
        return res.status(400).json({message: 'Email already exists'});
    }

    await User.create({
        name,
        email,
        phone,
        address,
        password: await bcrypt.hash(password, 10)
    });

    res.json({message: 'Account created successfully. Please login'});
});

r.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const u = await User.findOne({email});

    if (!u || !(await bcrypt.compare(password, u.password))) {
        return res.status(401).json({message: 'Invalid email or password'});
    }

    res.json({
        token: token(u),
        user: {
            _id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            address: u.address,
            role: u.role
        }
    });
});

r.post('/admin', async (req, res) => {
    const {email, password} = req.body;

    const u = await User.findOne({email, role: 'admin'});

    if (!u || !(await bcrypt.compare(password, u.password))) {
        return res.status(401).json({message: 'Invalid admin email or password'});
    }

    res.json({
        token: token(u),
        user: {
            _id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            address: u.address,
            role: u.role
        }
    });
});

r.get('/profile', auth, (req, res) => res.json(req.user));

r.put('/profile', auth, async (req, res) => {
    const u = await User.findByIdAndUpdate(req.user._id, req.body, {new: true}).select('-password');
    res.json(u);
});

export default r;