/**
 * Optimize Cloudinary image URLs with automatic format and quality settings
 * @param {string} url - The original image URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Custom width (overrides context)
 * @param {string} options.quality - Quality setting (default: 'auto')
 * @param {string} options.format - Format setting (default: 'auto')
 * @param {string} options.context - Preset context: 'grid', 'modal', 'hero', 'thumbnail'
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (url, options = {}) => {
    // Return original URL if not provided or not Cloudinary
    if (!url || !url.includes('cloudinary.com')) return url;

    const { width, quality = 'auto', format = 'auto', context = 'grid' } = options;

    // Context-specific width defaults
    const contextWidths = {
        grid: 600,       // Product grid thumbnails
        modal: 1200,     // Product detail modal
        hero: 1920,      // Hero section images
        thumbnail: 300   // Small thumbnails
    };

    const targetWidth = width || contextWidths[context] || 600;

    // Build transformation string
    const transformations = `q_${quality},f_${format},w_${targetWidth},c_limit`;

    // Insert transformations into Cloudinary URL
    // Cloudinary URL format: .../upload/[transformations]/filename
    return url.replace('/upload/', `/upload/${transformations}/`);
};

/**
 * Get image priority attribute based on position
 * First 4 images get high priority for faster loading
 * @param {number} index - Image index in the list
 * @param {number} total - Total number of images (optional)
 * @returns {string} 'high' or 'auto'
 */
export const getImagePriority = (index, total) => {
    return index < 4 ? 'high' : 'auto';
};

/**
 * Get lazy loading attribute based on position
 * First 4 images load eagerly, rest load lazily
 * @param {number} index - Image index in the list
 * @returns {string} 'eager' or 'lazy'
 */
export const getLazyLoading = (index) => {
    return index < 4 ? 'eager' : 'lazy';
};
