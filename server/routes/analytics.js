const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// In-memory store for active sessions
// Map<sessionId, { lastSeen: number, hasCart: boolean, isCheckout: boolean, date: string }>
const activeSessions = new Map();

// In-memory store for "Today's" hourly stats (reset on restart or midnight)
// Index 0-23 corresponds to hour
let hourlyVisitors = new Array(24).fill(0);
let lastResetDate = new Date().getDate();

// Clean up old sessions every 1 minute
setInterval(() => {
    const now = Date.now();
    for (const [id, session] of activeSessions.entries()) {
        if (now - session.lastSeen > 60000) { // 1 minute timeout
            activeSessions.delete(id);
        }
    }

    // Check for daily reset of hourly stats
    const currentDay = new Date().getDate();
    if (currentDay !== lastResetDate) {
        hourlyVisitors.fill(0);
        lastResetDate = currentDay;
    }
}, 60000);

// POST /heartbeat
router.post('/heartbeat', async (req, res) => {
    const { id, hasCart, isCheckout } = req.body;
    if (!id) return res.status(400).json({ error: 'Session ID required' });

    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const currentHour = new Date().getHours();

    let session = activeSessions.get(id);

    if (!session) {
        // NEW SESSION
        activeSessions.set(id, {
            lastSeen: now,
            hasCart,
            isCheckout,
            date: todayStr
        });

        // Update Memory Hourly Stats
        if (hourlyVisitors[currentHour] !== undefined) {
            hourlyVisitors[currentHour]++;
        }

        // Async update DB
        try {
            await prisma.analytics.upsert({
                where: { date: todayStr },
                update: { visitors: { increment: 1 } },
                create: { date: todayStr, visitors: 1, atc: 0 }
            });
        } catch (e) { console.error("Stats update failed", e); }

    } else {
        // EXISTING SESSION

        // Track ATC
        if (!session.hasCart && hasCart) {
            try {
                await prisma.analytics.upsert({
                    where: { date: todayStr },
                    update: { atc: { increment: 1 } },
                    create: { date: todayStr, visitors: 1, atc: 1 }
                });
            } catch (e) { console.error("ATC update failed", e); }
        }

        session.lastSeen = now;
        session.hasCart = hasCart;
        session.isCheckout = isCheckout;
        activeSessions.set(id, session);
    }

    res.sendStatus(200);
});

// GET /live
router.get('/live', async (req, res) => {
    try {
        let activeVisitors = 0;
        let activeCarts = 0;
        let activeCheckouts = 0;

        for (const session of activeSessions.values()) {
            activeVisitors++;
            if (session.hasCart) activeCarts++;
            if (session.isCheckout) activeCheckouts++;
        }

        // Get strictly recent purchases (last 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentPurchases = await prisma.order.count({
            where: { createdAt: { gte: oneDayAgo } }
        });

        // Get actual sales for TODAY (Since Midnight)
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const salesTodayAgg = await prisma.order.aggregate({
            _sum: { total: true },
            where: { createdAt: { gte: todayMidnight } }
        });
        const salesToday = salesTodayAgg._sum.total || 0;

        res.json({
            activeVisitors,
            activeCarts,
            activeCheckouts,
            recentPurchases,
            salesToday
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch live stats' });
    }
});

// GET /stats?range=today|7d|30d
router.get('/stats', async (req, res) => {
    try {
        const { range } = req.query;
        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        if (range === '7d') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (range === '30d') {
            startDate.setDate(startDate.getDate() - 30);
        }

        // 1. Fetch Orders (Source of Sales/Orders count)
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: range === 'today' ? new Date(new Date().setHours(0, 0, 0, 0)) : startDate
                }
            }
        });

        // 2. Fetch Analytics (Source of Visitors/ATC)
        // For 'today', we pull the daily total from DB (for summary) and use memory for chart
        // For '7d', we pull all days from DB
        const analyticsData = await prisma.analytics.findMany({
            where: {
                date: {
                    gte: startDate.toISOString().split('T')[0]
                }
            }
        });

        // Initialize data structure
        let chartData = [];
        let totalSales = 0;
        let totalOrders = 0;
        let totalVisitors = 0;
        let totalATC = 0;

        if (range === 'today') {
            // Hourly breakdown
            const hours = new Array(24).fill(0).map((_, i) => ({
                name: `${i}:00`, sales: 0, orders: 0, visitors: 0, atc: 0
            }));

            // Fill Sales/Orders from DB Orders
            orders.forEach(o => {
                const h = new Date(o.createdAt).getHours();
                hours[h].sales += o.total;
                hours[h].orders += 1;
                totalSales += o.total;
                totalOrders += 1;
            });

            // Fill Visitors from Memory (hourlyVisitors)
            // Note: ATC per hour is not tracked in memory, so we leave it 0 or flat
            hours.forEach((h, i) => {
                h.visitors = hourlyVisitors[i] || 0;
            });

            // Get Total Visitors for today from DB (more accurate if server restarted?)
            // Actually, if server restarted, DB > Memory.
            // But Memory tracks hourly distribution.
            // For Summary Card, we should use DB data.
            const todayStr = new Date().toISOString().split('T')[0];
            const todayAnalytics = analyticsData.find(a => a.date === todayStr);
            if (todayAnalytics) {
                totalVisitors = todayAnalytics.visitors;
                totalATC = todayAnalytics.atc;
            } else {
                // Fallback to memory sum if DB not yet updated (approx)
                totalVisitors = hourlyVisitors.reduce((a, b) => a + b, 0);
            }

            chartData = hours;

        } else {
            // Daily breakdown
            const daysMap = new Map();
            const daysCount = range === '7d' ? 7 : 30;
            for (let i = 0; i < daysCount; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const dateStr = d.toISOString().split('T')[0];
                daysMap.set(dateStr, { name: label, sales: 0, orders: 0, visitors: 0, atc: 0, date: d });
            }

            // Fill Sales/Orders
            orders.forEach(o => {
                const dateStr = new Date(o.createdAt).toISOString().split('T')[0];
                if (daysMap.has(dateStr)) {
                    const d = daysMap.get(dateStr);
                    d.sales += o.total;
                    d.orders += 1;
                    totalSales += o.total;
                    totalOrders += 1;
                }
            });

            // Fill Visitors/ATC from Analytics DB
            analyticsData.forEach(a => {
                if (daysMap.has(a.date)) {
                    const d = daysMap.get(a.date);
                    d.visitors = a.visitors;
                    d.atc = a.atc;
                }
            });

            // Calculate totals
            analyticsData.forEach(a => {
                totalVisitors += a.visitors;
                totalATC += a.atc;
            });
            // (Note: this sums up ALL fetched analytics. We should only sum matches if query range matches active range, which it does)

            // Convert map to array and reverse to show oldest first
            chartData = Array.from(daysMap.values()).sort((a, b) => a.date - b.date);
        }

        res.json({
            chartData,
            summary: {
                sales: totalSales,
                visitors: totalVisitors,
                orders: totalOrders,
                atc: totalATC,
                conversion: totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(2) : 0
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
