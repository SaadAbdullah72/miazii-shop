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

    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_API_KEY;

    if (!appId || !apiKey) {
        res.status(500);
        throw new Error('OneSignal configuration missing on server.');
    }

    try {
        const payload = {
            app_id: appId,
            headings: { en: title },
            contents: { en: message },
            url: url || "https://miazi-shop.vercel.app/",
            chrome_web_icon: "https://miazi-shop.vercel.app/logo-192.png",
            included_segments: ["Total Subscriptions"]
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
            const errorMsg = Array.isArray(data.errors) ? data.errors.join(', ') : JSON.stringify(data.errors);
            console.error('[OneSignal] Blast Rejected:', errorMsg);
            return res.status(400).json({ 
                message: `OneSignal Rejected: ${errorMsg}`, 
                errors: data.errors 
            });
        }

        res.status(200).json({
            message: `OneSignal Blast successful.`,
            summary: { id: data.id, recipients: data.recipients }
        });

    } catch (err) {
        res.status(500);
        throw new Error(`OneSignal Blast Crash: ${err.message}`);
    }
});