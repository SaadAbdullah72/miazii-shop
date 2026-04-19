/**
 * Utility to optimize image URLs for CDN (Cloudinary)
 * @param {string} url - Original image URL
 * @param {number} width - Desired width (optional)
 * @returns {string} - Optimized URL
 */
export const toCDN = (url, width) => {
    if (!url) return 'https://placehold.co/400x400?text=No+Image';

    // If it's already a full URL and NOT cloudinary or unsplash, just return it
    if (url.startsWith('http') && !url.includes('cloudinary.com') && !url.includes('unsplash.com')) {
        return url;
    }

    // Handle Unsplash dynamic CDN resizing and compression
    if (url.includes('images.unsplash.com')) {
        try {
            const urlObj = new URL(url);
            urlObj.searchParams.set('w', width || 400); // Standardize width vs 1000px default
            urlObj.searchParams.set('q', '60');         // Optimize quality parameter
            urlObj.searchParams.set('auto', 'format');  // Let browser use webp/avif
            return urlObj.toString();
        } catch(e) {
            return url;
        }
    }

    // Handle Cloudinary specifically for optimization
    if (url.includes('cloudinary.com')) {
        // Find the 'upload/' part and inject optimization parameters
        // f_auto: auto format (WebP/AVIF)
        // q_auto: auto quality
        // w_: fixed width if provided
        const optimization = `f_auto,q_auto${width ? `,w_${width}` : ''}`;
        
        if (url.includes('/upload/')) {
            return url.replace('/upload/', `/upload/${optimization}/`);
        }
    }

    // Fallback for local assets or unoptimized links
    return url;
};

/**
 * Common lazy-load placeholder
 */
export const PLACEHOLDER_IMAGE = 'https://placehold.co/400x400?text=Loading...';
export const ERROR_IMAGE = 'https://placehold.co/400x400?text=Image+Not+Found';
