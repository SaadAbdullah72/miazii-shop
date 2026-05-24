import express from 'express';
import rateLimit from 'express-rate-limit';
import { subscribeUser, blastNotifications } from '../controllers/pushController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// SECURITY: Rate limit subscription endpoint to prevent database flooding
const subscribeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many subscription attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Public: Users/Guests can subscribe to tokens
router.post('/subscribe', subscribeLimiter, subscribeUser);

// Admin Only: Send mass notifications
router.post('/blast', protect, admin, blastNotifications);

export default router;
