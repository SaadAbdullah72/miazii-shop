import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import Subscription from '../models/subscriptionModel.js';
import logger from '../utils/logger.js';

// Safe dispatch helper using dynamic imports
const safePushDispatch = async (title, message, link) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const mailEmail = process.env.VAPID_EMAIL || 'mailto:miazistore.bd@gmail.com';

    if (!publicKey || !privateKey) return;

    try {
        // Dynamic Import to prevent crash if library is missing in environment
        const webpush = (await import('web-push')).default;
        webpush.setVapidDetails(mailEmail, publicKey, privateKey);

        const subscriptions = await Subscription.find({});
        const payload = JSON.stringify({
            title: title || 'Miazii Shop Update',
            body: message,
            url: link || '/',
            icon: '/logo.png',
            badge: '/logo.png', // Small icon for the status bar
            tag: 'miazii-notification', // Groups/replaces similar notifications
            renotify: true, // Vibrates even if tag is the same
            timestamp: Date.now(),
            data: {
                url: link || '/'
            }
        });

        const pushPromises = subscriptions.map(sub =>
            webpush.sendNotification(sub, payload).catch(err => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    return Subscription.deleteOne({ _id: sub._id });
                }
            })
        );
        await Promise.all(pushPromises);
    } catch (err) {
        console.error('[Push] Isolated Error:', err.message);
    }
};

// @desc    Get all active notifications
// @route   GET /api/notifications
// @access  Public
export const getActiveNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 }).limit(10);
    res.json(notifications);
});

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private/Admin
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

    // Trigger push without blocking response
    safePushDispatch(title, message, link);

    res.status(201).json(createdNotification);
});

// @desc    Subscribe for Push Notifications
// @route   POST /api/notifications/subscribe
// @access  Public
export const subscribeUser = asyncHandler(async (req, res) => {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
        res.status(400);
        throw new Error('Invalid subscription');
    }

    await Subscription.findOneAndUpdate(
        { endpoint: subscription.endpoint },
        { ...subscription, user: req.user?._id || null },
        { upsert: true, new: true }
    );

    res.status(201).json({ success: true });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
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
