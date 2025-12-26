const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create transporter dynamically based on settings
const createTransporter = async () => {
    const settings = await prisma.settings.findFirst();
    if (!settings || !settings.smtpHost) {
        return null;
    }

    return nodemailer.createTransport({
        host: settings.smtpHost,
        port: parseInt(settings.smtpPort) || 587,
        secure: settings.smtpSecure, // true for 465, false for other ports
        auth: {
            user: settings.smtpUser,
            pass: settings.smtpPass,
        },
    });
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter();
        const settings = await prisma.settings.findFirst();

        if (!transporter) {
            console.log('❌ Email skipped: No SMTP settings found.');
            console.log('Current Settings:', {
                host: settings?.smtpHost,
                user: settings?.smtpUser,
                hasPass: !!settings?.smtpPass
            });
            return false;
        }

        console.log(`📧 Attempting to send email to: ${to} | Subject: ${subject}`);

        const info = await transporter.sendMail({
            from: `"${settings.smtpUser}" <${settings.smtpUser}>`, // sender address
            to,
            subject,
            html,
        });

        console.log("✅ Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
};

const emailService = {
    sendOrderConfirmation: async (order) => {
        const subject = `Order Confirmation #${order.id} - AHN White+`;

        let items = [];
        try {
            items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        } catch (e) {
            console.error("Error parsing items for email:", e);
            items = [];
        }

        const itemsList = items.map(item =>
            `<li>${item.name} x${item.quantity} - Rs. ${item.price.toLocaleString()}</li>`
        ).join('');

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #be123c;">Thank you for your order!</h1>
                <p>Hi ${order.customerName},</p>
                <p>We have received your order. We will contact you shortly to confirm details before shipping.</p>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Order #${order.id}</h3>
                    <p><strong>Total:</strong> Rs. ${order.total.toLocaleString()}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 15px 0;">
                    <ul style="padding-left: 20px; margin-bottom: 0;">
                        ${itemsList}
                    </ul>
                </div>

                <p>If you have any questions, reply to this email.</p>
                <p>Best regards,<br>AHN White+ Team</p>
            </div>
        `;

        if (order.email) {
            return sendEmail(order.email, subject, html);
        }
        return false;
    },

    sendOrderShipped: async (order) => {
        const subject = `Your Order #${order.id} has been Shipped! 🚚`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #be123c;">Good News!</h1>
                <p>Hi ${order.customerName},</p>
                <p>Your order has been shipped and is on its way.</p>
                <p>You should receive it within 2-4 working days.</p>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Shipping Details</h3>
                    <p><strong>Address:</strong> ${order.address}, ${order.city}</p>
                    <p><strong>COD Amount:</strong> Rs. ${order.total.toLocaleString()}</p>
                </div>

                <p>Thank you for choosing AHN White+!</p>
            </div>
        `;

        if (order.email) {
            return sendEmail(order.email, subject, html);
        }
        return false;
    },

    sendAdminNotification: async (order) => {
        const settings = await prisma.settings.findFirst();
        if (!settings || !settings.adminEmails) return;

        const emails = settings.adminEmails.split(',').map(e => e.trim());
        const subject = `[NEW ORDER] #${order.id} - Rs. ${order.total}`;

        let items = [];
        try {
            items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        } catch (e) {
            console.error("Error parsing items for admin email:", e);
            items = [];
        }

        const itemsList = items.map(item =>
            `<li>${item.name} x${item.quantity}</li>`
        ).join('');

        const html = `
            <h2>New Order Received</h2>
            <p><strong>Customer:</strong> ${order.customerName} (${order.phone})</p>
            <p><strong>City:</strong> ${order.city}</p>
            <p><strong>Total:</strong> Rs. ${order.total.toLocaleString()}</p>
            <ul>${itemsList}</ul>
            <a href="https://ahnskin.com/admin" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin</a>
        `;

        for (const email of emails) {
            await sendEmail(email, subject, html);
        }
    }
};

module.exports = emailService;
