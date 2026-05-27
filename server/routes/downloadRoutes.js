import express from 'express';
import asyncHandler from 'express-async-handler';
import Download from '../models/downloadModel.js';

const router = express.Router();

// @desc    Get real-time download count
// @route   GET /api/download-count
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    let download = await Download.findOne();
    if (!download) {
        // Initialize if not present starting at 0
        download = await Download.create({ count: 0 });
    } else if (download.count === 12450) {
        // Automatically reset to 0 if it was initialized with our old placeholder value
        download.count = 0;
        await download.save();
    }
    
    // Enable CORS specifically for this public route to allow the standalone site to fetch it
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.json({ count: download.count });
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.json({ success: true, count: download.count });
}));

// Handle preflight options requests for CORS
router.options('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(204);
});

export default router;
