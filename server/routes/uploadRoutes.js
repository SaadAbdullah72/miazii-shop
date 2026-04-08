import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Memory Storage for Serverless environments (Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Universal Cloudinary Stream Upload logic
 */
const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        Readable.from(fileBuffer).pipe(uploadStream);
    });
};

// Image Upload (Migrated to Cloudinary)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'products/images', 'image');

        res.send({
            message: 'Image uploaded successfully',
            image: result.secure_url, // Full Cloudinary URL
        });
    } catch (error) {
        console.error('Cloudinary Image Upload Error:', error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

// Cloudinary Video Upload
router.post('/video', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'products/videos', 'video');

        res.send({
            message: 'Video uploaded successfully',
            videoUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Cloudinary Video Upload Error:', error);
        res.status(500).json({ message: 'Video upload failed', error: error.message });
    }
});

export default router;


