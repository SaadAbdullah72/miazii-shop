/**
 * Utility to optimize image URLs for CDN (Cloudinary)
 * @param {string} url - Original image URL
 * @param {number} width - Desired width (optional)
 * @returns {string} - Optimized URL
 */
export const toCDN = (url, width) => {
    if (!url || typeof url !== 'string' || url.includes('placehold.co')) return ERROR_IMAGE;

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

    // Critical Fix: Vercel does not serve local /uploads/ files after deployment.
    // Detect local uploads and return a placeholder if not in development mode.
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
        // If we are on production (miazi-shop.vercel.app), these will 404.
        // Return a professional placeholder instead of a broken icon.
        return ERROR_IMAGE;
    }

    // Fallback for local assets or unoptimized links
    return url;
};

/**
 * Modern Base64 SVG offline-proof fallbacks (Zero-Network Skeletons)
 */
export const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EProduct%20Preview%3C%2Ftext%3E%3C%2Fsvg%3E";
export const ERROR_IMAGE = PLACEHOLDER_IMAGE;
