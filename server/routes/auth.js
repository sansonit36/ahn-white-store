const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ahn-white-secret-key-change-this';

// Seed Default Admin if not exists
const SEED_ADMIN = async () => {
    const count = await prisma.adminUser.count();
    if (count === 0) {
        await prisma.adminUser.create({
            data: {
                username: 'admin',
                password: 'admin123'
            }
        });
        console.log("Default admin created: admin / admin123");
    }
};
SEED_ADMIN();

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.adminUser.findUnique({ where: { username } });

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({ token, username: user.username });
});

// Verify/Me
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ username: decoded.username });
    } catch (err) {
        console.error("JWT Verification Failed:", err.message);
        return res.status(401).json({ error: 'Invalid token', details: err.message });
    }
});

// Logout (Client-side only for JWT, but can implement blacklist if needed)
router.post('/logout', (req, res) => {
    res.json({ success: true });
});

module.exports = router;
