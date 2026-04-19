import express from 'express';
import { generateSignature } from '../utils/cloudinary.js';

const router = express.Router();

// Secure Signature Generation for Frontend Direct Upload
router.get('/signature', (req, res) => {
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

// Keep the old routes around just in case someone still hits them but return a polite error or just remove them.
// Removing them forces frontend to adopt the new method instantly.

export default router;


