const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// POST new review
router.post('/', async (req, res) => {
    try {
        const review = await prisma.review.create({
            data: req.body
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// DELETE review
router.delete('/:id', async (req, res) => {
    try {
        await prisma.review.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;
