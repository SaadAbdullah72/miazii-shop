import app from '../server/server.js';

// Vercel Serverless Entry Point
export default async (req, res) => {
    try {
        return app(req, res);
    } catch (error) {
        console.error('Vercel Runtime Error:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};
