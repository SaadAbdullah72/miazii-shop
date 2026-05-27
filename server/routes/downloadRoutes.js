import express from 'express';
import asyncHandler from 'express-async-handler';
import Download from '../models/downloadModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get real-time download count and app configurations
// @route   GET /api/download-count
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    let download = await Download.findOne();
    if (!download) {
        // Initialize if not present
        download = await Download.create({
            count: 0,
            notificationTitle: "Notification",
            notificationMessage: "সেরা পারফরম্যান্স ও নির্ভরযোগ্য সার্ভিসের জন্য X KING V2RAY চালান — আমাদের ভিপিএন সম্পূর্ণ অটো-আপডেট সিস্টেম।",
            notificationActive: true,
            slides: [
                '/electro_slider_watch.png',
                '/slider-phone.png',
                '/splash-hand.png'
            ]
        });
    }
    
    // Enable CORS specifically for this public route to allow the standalone site to fetch it
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.json({
        count: download.count,
        notificationTitle: download.notificationTitle || "Notification",
        notificationMessage: download.notificationMessage || "",
        notificationActive: download.notificationActive !== false,
        slides: download.slides && download.slides.length > 0 ? download.slides : [
            '/electro_slider_watch.png',
            '/slider-phone.png',
            '/splash-hand.png'
        ]
    });
}));

// @desc    Increment download count in real-time
// @route   POST /api/download-count
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
    let download = await Download.findOne();
    if (!download) {
        download = await Download.create({ count: 0 });
    }
    download.count += 1;
    await download.save();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.json({ success: true, count: download.count });
}));

// @desc    Update app hub configurations (notification, slides, custom count)
// @route   PUT /api/download-count/config
// @access  Private/Admin
router.put('/config', protect, admin, asyncHandler(async (req, res) => {
    const { count, notificationTitle, notificationMessage, notificationActive, slides } = req.body;
    
    let download = await Download.findOne();
    if (!download) {
        download = new Download({});
    }

    if (count !== undefined) download.count = count;
    if (notificationTitle !== undefined) download.notificationTitle = notificationTitle;
    if (notificationMessage !== undefined) download.notificationMessage = notificationMessage;
    if (notificationActive !== undefined) download.notificationActive = notificationActive;
    if (slides !== undefined) download.slides = slides;

    const updatedConfig = await download.save();

    res.json({
        success: true,
        count: updatedConfig.count,
        notificationTitle: updatedConfig.notificationTitle,
        notificationMessage: updatedConfig.notificationMessage,
        notificationActive: updatedConfig.notificationActive,
        slides: updatedConfig.slides
    });
}));

// Handle preflight options requests for CORS
router.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204);
});

export default router;
