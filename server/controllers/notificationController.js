import asyncHandler from '../middleware/asyncHandler.js';
import Notification from '../models/notificationModel.js';

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
