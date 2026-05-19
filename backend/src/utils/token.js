import jwt from 'jsonwebtoken';

export const token = (u) =>
    jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
