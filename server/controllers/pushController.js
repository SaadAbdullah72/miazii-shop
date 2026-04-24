import asyncHandler from 'express-async-handler';
import Subscription from '../models/subscriptionModel.js';
import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const APP_URL = 'https://miazi-shop.vercel.app';

// Subscriptions and VAPID detail management


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

const sendWithRetry = async (sub, payload, options, retries = 3) => {
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
        title: title || "🛍️ Miazi Shop",
        body: message,
        url: url || "/",
        icon: "https://miazi-shop.vercel.app/logo-192.png",
        tag: "miazi-notification",
        renotify: true,
        data: {
          url: url || "/"
        }
    });

    // [ROBUST]: Set VAPID details immediately before sending to ensure they match current .env
    webpush.setVapidDetails(
        'mailto:miazistore.bd@gmail.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );

    const options = {
        TTL: 86400,
        urgency: 'high',
        topic: 'miazi-shop'
    };


    const results = await Promise.allSettled(
        subscriptions.map((sub) => sendWithRetry(sub, notificationPayload, options))
    );


    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    res.status(200).json({
        message: `Notification blast complete.`,
        summary: { total: subscriptions.length, successful, failed }
    });
});