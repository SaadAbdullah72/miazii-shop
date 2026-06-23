import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);                          // Public — frontend reads payment numbers
router.put('/', protect, admin, updateSettings);       // Admin only — update settings

export default router;
