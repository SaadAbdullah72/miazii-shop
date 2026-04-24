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
    const appId = process.env.ONESIGNAL_APP_ID?.trim();
    const apiKey = process.env.ONESIGNAL_API_KEY?.trim();

    if (!appId || !apiKey) {
        console.error('[Push] CANNOT SEND: OneSignal credentials missing from process.env');
        return;
    }

    try {
        console.log(`[OneSignal] Preparing dispatch for: ${userId || 'ALL USERS'}`);
        
        const payload = {
            app_id: appId,
            headings: { en: title || "🛍️ Miazi Shop" },
            contents: { en: message },
            url: link || "https://miazi-shop.vercel.app/",
            chrome_web_icon: "https://miazi-shop.vercel.app/logo-192.png",
            // If userId is provided, target that specific user via external_id
            ...(userId ? { include_external_user_ids: [userId.toString()] } : { included_segments: ["All"] })
        };

        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.errors) {
            console.error('[OneSignal] Dispatch Errors:', data.errors);
        } else {
            console.log(`[OneSignal] Success! Notification ID: ${data.id} | Recipients: ${data.recipients || 'Pending'}`);
        }

    } catch (err) {
        console.error('[OneSignal] Critical dispatch failure:', err.message);
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

    await safePushDispatch(title, message, link).catch(err => {
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