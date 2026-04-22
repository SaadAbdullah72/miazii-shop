import asyncHandler from 'express-async-handler';
import Subscription from '../models/subscriptionModel.js';
import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

// Configure VAPID keys for Web Push
webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:miazi.shop@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// @desc    Subscribe to push notifications
// @route   POST /api/push/subscribe
// @access  Public
export const subscribeUser = asyncHandler(async (req, res) => {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
        res.status(400);
        throw new Error('Invalid endpoint format for Web Push subscription.');
    }

    const userId = req.user ? req.user._id : null;
    const existingSub = await Subscription.findOne({ endpoint: subscription.endpoint });

    if (existingSub) {
        if (userId && !existingSub.user) {
            existingSub.user = userId;
            await existingSub.save();
        }
        return res.status(200).json({ message: 'Subscription already active' });
    }

    const newSubscription = new Subscription({
        user: userId,
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys,
    });

    await newSubscription.save();
    res.status(201).json({ message: 'Push subscription successfully captured.' });
});

// @desc    Blast push notifications to all subscribers
// @route   POST /api/push/blast
// @access  Private/Admin
export const blastNotifications = asyncHandler(async (req, res) => {
    const { title, message, url } = req.body;

    if (!title || !message) {
        res.status(400);
        throw new Error('Please provide both title and message for the blast.');
    }

    const subscriptions = await Subscription.find({});

    if (subscriptions.length === 0) {
        return res.status(200).json({ message: 'No active subscriptions found.' });
    }

    const notificationPayload = JSON.stringify({
        title,
        body: message,
        url: url || '/',
        icon: '/logo.png', // Large icon
        badge: '/badge-monochrome.png', // Status bar badge
    });

    const results = await Promise.allSettled(
        subscriptions.map((sub) =>
            webpush.sendNotification(sub, notificationPayload).catch(async (err) => {
                // If subscription has expired or is no longer valid, remove it from DB
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await Subscription.deleteOne({ endpoint: sub.endpoint });
                }
                throw err;
            })
        )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    res.status(200).json({
        message: `Notification blast complete.`,
        summary: { total: subscriptions.length, successful, failed }
    });
});
