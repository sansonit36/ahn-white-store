const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET settings
router.get('/', async (req, res) => {
    try {
        let settings = await prisma.settings.findFirst();
        if (!settings) {
            // Create default settings if none exist
            settings = await prisma.settings.create({
                data: { id: 1 }
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT update settings
router.put('/', async (req, res) => {
    try {
        let settings = await prisma.settings.findFirst();
        if (!settings) {
            settings = await prisma.settings.create({ data: { id: 1, ...req.body } });
        } else {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: req.body
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

module.exports = router;
