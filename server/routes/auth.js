const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simple in-memory session store for demo (production should use Redis/JWT)
// Map<token, { userId: number, username: string, expires: number }>
const sessions = new Map();

// Seed Default Admin if not exists
// In production, password should be hashed (bcrypt)
// For this demo, we store plaintext or simple transformation
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

    // Generate simple token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    sessions.set(token, {
        userId: user.id,
        username: user.username,
        expires
    });

    res.json({ token, username: user.username });
});

// Verify/Me
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];
    const session = sessions.get(token);

    if (!session || Date.now() > session.expires) {
        sessions.delete(token);
        return res.status(401).json({ error: 'Session expired' });
    }

    res.json({ username: session.username });
});

// Logout
router.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        sessions.delete(token);
    }
    res.json({ success: true });
});

module.exports = router;
