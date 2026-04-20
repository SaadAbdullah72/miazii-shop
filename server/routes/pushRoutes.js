import express from 'express';
import { subscribeUser, blastNotifications } from '../controllers/pushController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Users/Guests can subscribe to tokens
router.post('/subscribe', subscribeUser);

// Admin Only: Send mass notifications
router.post('/blast', protect, admin, blastNotifications);

export default router;
