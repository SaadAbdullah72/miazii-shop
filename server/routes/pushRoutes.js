import express from 'express';
import { subscribeUser } from '../controllers/pushController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow guests to subscribe too, so we don't strictly protect it,
// but we can manually extract token if it exists in the controller using an optional auth middleware if needed.
// For now, we'll keep it public. 
router.post('/subscribe', subscribeUser);

export default router;
