import api from './axiosConfig';

/**
 * Uploads a file directly to Cloudinary bypassing the local server.
 * Requires the backend to provide a signature.
 * 
 * @param {File} file - The file to upload
 * @param {string} folder - Destination folder in Cloudinary (e.g., 'profile/avatars')
 * @returns {Promise<string>} - The secure URL of the uploaded asset
 */
export const uploadToCloudinaryDirect = async (file, folder) => {
    // Step 1: Get signature from backend
    // Use Axios params to ensure folder name (with slashes) is correctly encoded
    const { data: sigData } = await api.get('/api/upload/signature', {
        params: { folder }
    });
    
    if (!sigData.cloudName || !sigData.apiKey) {
        throw new Error('Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY to environment variables.');
    }

    // Determine resource type based on file type (image or video)
    const resourceType = file.type.startsWith('video') ? 'video' : 'image';

    // Step 2: Push directly to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', sigData.timestamp);
    formData.append('signature', sigData.signature);
    formData.append('folder', folder);
    
    // Use 'auto' or specific resource type for flexibility
    const response = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Cloudinary Error: ${errData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.secure_url;
};
