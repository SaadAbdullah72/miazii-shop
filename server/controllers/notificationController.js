import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import Subscription from '../models/subscriptionModel.js';
import logger from '../utils/logger.js';

const APP_URL = 'https://miazi-shop.vercel.app';

const sendWithRetry = async (webpush, sub, payload, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            await webpush.sendNotification(sub, payload, options);
            return true;
        } catch (err) {
            if (err.statusCode === 410 || err.statusCode === 404) {
                await Subscription.deleteOne({ endpoint: sub.endpoint });
                return false;
            }
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
};

export const safePushDispatch = async (title, message, link, userId = null) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const mailEmail = process.env.VAPID_EMAIL || 'mailto:miazistore.bd@gmail.com';

    if (!publicKey || !privateKey) {
        console.error('[Push] CANNOT SEND: VAPID keys missing from process.env');
        return;
    }

    try {
        // [TARGETING]: If userId is provided, only send to that user's devices. Otherwise, broadcast to all.
        const query = userId ? { user: userId } : {};
        const subscriptions = await Subscription.find(query);
        console.log(`[Push] Found ${subscriptions.length} subscriptions in DB for target: ${userId || 'BROADCAST'}`);

        if (subscriptions.length === 0) {
            console.warn('[Push] Skipping: No devices registered.');
            return;
        }

        const webpushModule = await import('web-push');
        const webpush = webpushModule.default || webpushModule;

        webpush.setVapidDetails(mailEmail, publicKey, privateKey);

        const payload = JSON.stringify({
            title: title || "🛍️ Miazi Shop",
            body: message,
            url: link || "/",
            icon: "https://miazi-shop.vercel.app/logo-192.png",
            tag: "miazi-notification",
            renotify: true,
            data: {
              url: link || "/"
            }
        });

        const options = {
            TTL: 86400,
            urgency: 'high',
            topic: 'miazi-shop'
        };

        const pushPromises = subscriptions.map(sub => sendWithRetry(webpush, sub, payload, options));
        await Promise.allSettled(pushPromises);

    } catch (err) {
        console.error('[Push] Diagnostic Crash:', err.message);
    }
};


export const getActiveNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 }).limit(10);
    res.json(notifications);
});

export const createNotification = asyncHandler(async (req, res) => {
    const { title, message, type, link } = req.body;

    const notification = new Notification({
        title,
        message,
        type,
        link,
        createdBy: req.user._id,
    });

    const createdNotification = await notification.save();

    safePushDispatch(title, message, link).catch(err => {
        console.error('[Push] Automation Error:', err.message);
    });

    res.status(201).json(createdNotification);
});

export const subscribeUser = asyncHandler(async (req, res) => {
    const subscription = req.body;
    console.log('[Push] Registration Attempt received.');

    if (!subscription || !subscription.endpoint) {
        console.error('[Push] Registration FAILED: No subscription body provided.');
        res.status(400);
        throw new Error('Invalid subscription');
    }

    const updatedSub = await Subscription.findOneAndUpdate(
        { endpoint: subscription.endpoint },
        { ...subscription, user: req.user?._id || null },
        { upsert: true, new: true }
    );

    console.log('[Push] Registration SUCCESS for endpoint:', subscription.endpoint.substring(0, 30));
    res.status(201).json({ success: true });
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});