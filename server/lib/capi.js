const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const moment = require('moment'); // You might need moment or just use native Date

// Helper to hash data (Email/Phone) if needed, but for simplicity we send plain if allowed or hash manually
// Facebook requires SHA256 hashing for user data like email/phone
const crypto = require('crypto');
function hash(str) {
    if (!str) return null;
    return crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex');
}

/**
 * Send Purchase Event to Facebook CAPI
 */
const sendFacebookPurchase = async (order, req) => {
    try {
        const settings = await prisma.settings.findFirst();
        if (!settings || !settings.facebookPixelId || !settings.facebookCAPIToken) return;

        const eventData = {
            data: [
                {
                    event_name: 'Purchase',
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    user_data: {
                        em: [hash(order.customerName)], // Just placeholder, normally email. We might use phone?
                        ph: [hash(order.phone)],
                        client_ip_address: req.ip || req.connection.remoteAddress,
                        client_user_agent: req.headers['user-agent'],
                        // If we had fbc/fbp cookies, we'd add them here
                    },
                    custom_data: {
                        currency: 'PKR',
                        value: order.total,
                        order_id: order.id,
                        content_ids: order.items.map(i => i.id),
                        content_type: 'product',
                        num_items: order.items.reduce((acc, i) => acc + i.quantity, 0)
                    }
                }
            ],
            access_token: settings.facebookCAPIToken,
            partner_agent: 'antigravity-adapter-1.0' // Optional
        };

        const url = `https://graph.facebook.com/v19.0/${settings.facebookPixelId}/events`;

        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });

        console.log(`[FB CAPI] Purchase Sent for Order ${order.id}`);

    } catch (e) {
        console.error("[FB CAPI] Error:", e.message);
    }
};

/**
 * Send Purchase Event to TikTok Events API
 */
const sendTikTokPurchase = async (order, req) => {
    try {
        const settings = await prisma.settings.findFirst();
        if (!settings || !settings.tiktokPixelId || !settings.tiktokCAPIToken) return;

        const eventData = {
            pixel_code: settings.tiktokPixelId,
            event: 'PlaceAnOrder', // TikTok standard event for Purchase/PlaceOrder
            event_id: order.id,
            timestamp: new Date().toISOString(),
            context: {
                user_agent: req.headers['user-agent'],
                ip: req.ip || req.connection.remoteAddress,
                page: {
                    url: 'https://ahn-white-store.com/checkout' // Placeholder or passed from req
                },
                user: {
                    phone_number: hash(order.phone) // TikTok likes hashed phone
                }
            },
            properties: {
                currency: 'PKR',
                value: order.total,
                contents: order.items.map(item => ({
                    content_id: item.id,
                    content_type: 'product',
                    content_name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        };

        const url = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Token': settings.tiktokCAPIToken
            },
            body: JSON.stringify(eventData)
        });

        console.log(`[TikTok CAPI] Purchase Sent for Order ${order.id}`);

    } catch (e) {
        console.error("[TikTok CAPI] Error:", e.message);
    }
};

module.exports = {
    sendFacebookPurchase,
    sendTikTokPurchase
};
