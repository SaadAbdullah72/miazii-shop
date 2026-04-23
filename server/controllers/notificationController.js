import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import Subscription from '../models/subscriptionModel.js';
import logger from '../utils/logger.js';

const APP_URL = 'https://miazi-shop.vercel.app';

export const safePushDispatch = async (title, message, link) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const mailEmail = process.env.VAPID_EMAIL || 'mailto:miazistore.bd@gmail.com';

    if (!publicKey || !privateKey) {
        console.error('[Push] CANNOT SEND: VAPID keys missing from process.env');
        return;
    }

    try {
        const subscriptions = await Subscription.find({});
        console.log(`[Push] Found ${subscriptions.length} subscriptions in DB.`);

        if (subscriptions.length === 0) {
            console.warn('[Push] Skipping: No devices registered.');
            return;
        }

        const webpushModule = await import('web-push');
        const webpush = webpushModule.default || webpushModule;

        webpush.setVapidDetails(mailEmail, publicKey, privateKey);

        const payload = JSON.stringify({
            title: title || 'Miazi Shop',
            body: message,
            url: link || '/',
            icon: `${APP_URL}/icons/icon-192x192.png`,
            badge: `${APP_URL}/badge-miazi-v50.png`,
            tag: 'miazi-notification',
            renotify: true,
            timestamp: Date.now(),
            data: {
                url: link || '/'
            }
        });

        const options = {
            vapidDetails: {
                subject: mailEmail,
                publicKey: publicKey,
                privateKey: privateKey
            },
            TTL: 86400,
            urgency: 'high'
        };

        const pushPromises = subscriptions.map(sub =>
            webpush.sendNotification(sub, payload, options)
                .then(res => {
                    console.log(`[Push] SUCCESS | Status: ${res.statusCode} | Endpoint: ${sub.endpoint.substring(0, 30)}...`);
                    return res;
                })
                .catch(err => {
                    console.error(`[Push] FAILED | Status: ${err.statusCode} | Error: ${err.message}`);
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        return Subscription.deleteOne({ _id: sub._id });
                    }
                })
        );
        await Promise.all(pushPromises);
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