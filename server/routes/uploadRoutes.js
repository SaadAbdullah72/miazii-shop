import express from 'express';
import { generateSignature } from '../utils/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Secure Signature Generation for Frontend Direct Upload
router.get('/signature', protect, (req, res) => {
    try {
        const folder = req.query.folder || 'products/images';
        const sigData = generateSignature(folder);
        res.json(sigData);
    } catch (error) {
        console.error('Signature Generation Error:', error);
        res.status(500).json({ 
            message: 'Failed to generate signature', 
            error: error.message 
        });
    }
});

// Diagnostic route to check server configuration (Safe Version)
router.get('/check-config', protect, admin, (req, res) => {
    const config = {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configured' : '❌ MISSING',
        apiKey: process.env.CLOUDINARY_API_KEY ? '✅ Configured' : '❌ MISSING',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? '✅ Configured (Masked)' : '❌ MISSING',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    };
    
    const isAllOk = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
    
    res.json({
        status: isAllOk ? 'READY' : 'INCOMPLETE',
        config,
        help: isAllOk ? 'Your server is ready for uploads.' : 'Please add the missing keys in your Vercel Dashboard.'
    });
});

// Keep the old routes around just in case someone still hits them but return a polite error or just remove them.
// Removing them forces frontend to adopt the new method instantly.

export default router;


