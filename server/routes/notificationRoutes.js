import express from 'express';
const router = express.Router();
import {
    getActiveNotifications,
    createNotification,
    deleteNotification,
} from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(getActiveNotifications)
    .post(protect, admin, createNotification);

router.route('/:id').delete(protect, admin, deleteNotification);

export default router;
