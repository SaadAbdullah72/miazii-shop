import express from 'express';
import {
    initPayment,
    paymentSuccess,
    paymentFail,
    paymentCancel
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/init/:orderId', protect, initPayment);
router.post('/success', paymentSuccess);
router.post('/fail', paymentFail);
router.post('/cancel', paymentCancel);

export default router;
