import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import Subscription from '../models/subscriptionModel.js';
import webpush from 'web-push';
import logger from '../utils/logger.js';

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

    // ==========================================
    // DISPATCH NATIVE WEB PUSH TO ALL DEVICES
    // ==========================================
    try {
        if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
            logger.warn('Web Push VAPID Keys missing in env. Skipping offline dispatch.');
        } else {
            webpush.setVapidDetails(
                process.env.VAPID_EMAIL || 'mailto:admin@miazii.com',
                process.env.VAPID_PUBLIC_KEY,
                process.env.VAPID_PRIVATE_KEY
            );

            // Fetch all active subscriptions across all users/guests
            const activeSubscriptions = await Subscription.find({});
            const payload = JSON.stringify({
                title: createdNotification.title,
                body: createdNotification.message,
                icon: '/logo.png', // The app's logo
                url: createdNotification.link || '/', 
                badge: '/icons.svg', 
            });

            // Dispatch silently in background block
            const notificationsPromise = activeSubscriptions.map(sub =>
                webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: sub.keys
                    },
                    payload
                ).catch((err) => {
                    // Common error: Subscription expired or revoked
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        logger.info(`Cleaning up dead subscription: ${sub.endpoint}`);
                        return Subscription.deleteOne({ _id: sub._id });
                    } else {
                        logger.error('Push Sending Error:', err);
                    }
                })
            );

            // Execute all background pushes concurrently but don't strictly await it blocking the UI
            Promise.allSettled(notificationsPromise).then(results => {
                logger.info(`Web Push broadcast completed for ${results.length} offline endpoints.`);
            });
        }
    } catch(err) {
        logger.error('Fatal Web Push execution error:', err);
    }

    res.status(201).json(createdNotification);
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
