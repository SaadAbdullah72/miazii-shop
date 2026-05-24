import express from 'express';
import rateLimit from 'express-rate-limit';
const router = express.Router();
import {
    getActiveNotifications,
    createNotification,
    deleteNotification,
    subscribeUser
} from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// SECURITY: Rate limit subscription endpoint to prevent database flooding
const subscribeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many subscription attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

router.route('/')
    .get(getActiveNotifications)
    .post(protect, admin, createNotification);

router.post('/subscribe', subscribeLimiter, subscribeUser);

router.route('/:id').delete(protect, admin, deleteNotification);

export default router;
