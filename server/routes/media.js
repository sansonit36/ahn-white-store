const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all media
router.get('/', async (req, res) => {
    try {
        const media = await prisma.media.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch media' });
    }
});

// POST add media info (after upload)
router.post('/', async (req, res) => {
    try {
        const media = await prisma.media.create({
            data: req.body
        });
        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add media' });
    }
});

// DELETE media
router.delete('/:id', async (req, res) => {
    try {
        await prisma.media.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Media deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete media' });
    }
});

module.exports = router;
