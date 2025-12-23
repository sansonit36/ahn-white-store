const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all orders (with pagination & filtering)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 50, startDate, endDate, status, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const where = {};

        // Date Filter
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        // Status Filter
        if (status && status !== 'All') {
            where.status = status;
        }

        // Search Filter (by ID, customer name, phone)
        if (search) {
            where.OR = [
                { id: { contains: search } },
                { customerName: { contains: search } },
                { phone: { contains: search } }
            ];
        }

        // Fetch Data & Count
        const [orders, total] = await prisma.$transaction([
            prisma.order.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.order.count({ where })
        ]);

        // Parse items JSON
        const parsedOrders = orders.map(order => ({
            ...order,
            items: JSON.parse(order.items)
        }));

        res.json({
            data: parsedOrders,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

const { sendFacebookPurchase, sendTikTokPurchase } = require('../lib/capi');

// POST create order
router.post('/', async (req, res) => {
    try {
        const { items, ...orderData } = req.body;
        const order = await prisma.order.create({
            data: {
                ...orderData,
                items: JSON.stringify(items) // Serialize items
            }
        });

        // Trigger CAPI Events (Async - don't block response)
        const fullOrder = { ...order, items }; // Pass parsed items
        sendFacebookPurchase(fullOrder, req).catch(console.error);
        sendTikTokPurchase(fullOrder, req).catch(console.error);

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// PUT update order status
router.put('/:id', async (req, res) => {
    try {
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: req.body
        });
        // Parse items before returning
        order.items = JSON.parse(order.items);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// DELETE order
router.delete('/:id', async (req, res) => {
    try {
        await prisma.order.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

module.exports = router;
