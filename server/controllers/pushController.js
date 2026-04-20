import asyncHandler from 'express-async-handler';
import Subscription from '../models/subscriptionModel.js';

// @desc    Subscribe to push notifications
// @route   POST /api/push/subscribe
// @access  Public (Optional User binding handled via req.user)
export const subscribeUser = asyncHandler(async (req, res) => {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
        res.status(400);
        throw new Error('Invalid endpoint format for Web Push subscription.');
    }

    // Bind User ID if they provided an auth token and user object exists, but allow null for guests
    const userId = req.user ? req.user._id : null;

    // Check if subscription already exists (to prevent duplicating tokens)
    const existingSub = await Subscription.findOne({ endpoint: subscription.endpoint });

    if (existingSub) {
        // Update user binding if they logged in later
        if (userId && !existingSub.user) {
            existingSub.user = userId;
            await existingSub.save();
        }
        return res.status(200).json({ message: 'Subscription already active' });
    }

    // Save to DB
    const newSubscription = new Subscription({
        user: userId,
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys,
    });

    await newSubscription.save();
    res.status(201).json({ message: 'Push subscription successfully captured.' });
});
