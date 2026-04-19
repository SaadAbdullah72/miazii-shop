import { v2 as cloudinary } from 'cloudinary';

// Dynamic initialization for Serverless stability
const getCloudinaryConfig = () => {
    return {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    };
};

/**
 * Generates a secure signature for direct frontend uploads
 * @param {string} folder - Target folder in Cloudinary
 * @returns {object} { timestamp, signature, cloudName, apiKey }
 */
export const generateSignature = (folder = 'products/images') => {
    const config = getCloudinaryConfig();
    
    // Safety Check
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
        throw new Error('Cloudinary configuration is incomplete. Check environment variables.');
    }

    cloudinary.config(config);

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        config.api_secret
    );

    return {
        timestamp,
        signature,
        cloudName: config.cloud_name,
        apiKey: config.api_key,
    };
};

export default cloudinary;
