const CACHE_PREFIX = 'bw_cache_';
const DEFAULT_TTL = 300; // 5 minutes in seconds

/**
 * Client-side caching utility using localStorage with TTL and quota management
 */
export const clientCache = {
    /**
     * Store data in localStorage with TTL
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in seconds (default: 300s)
     */
    set(key, data, ttl = DEFAULT_TTL) {
        try {
            const cacheEntry = {
                data,
                timestamp: Date.now(),
                ttl: ttl * 1000 // Convert to milliseconds
            };
            localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
        } catch (error) {
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded, clearing oldest entries...');
                this.clearOldest();
                // Retry after clearing
                try {
                    const cacheEntry = {
                        data,
                        timestamp: Date.now(),
                        ttl: ttl * 1000
                    };
                    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
                } catch (retryError) {
                    console.error('Failed to cache data after cleanup:', retryError);
                }
            } else {
                console.error('Error caching data:', error);
            }
        }
    },

    /**
     * Retrieve data from localStorage
     * @param {string} key - Cache key
     * @returns {object|null} { data, age } or null if expired/missing
     */
    get(key) {
        try {
            const cached = localStorage.getItem(CACHE_PREFIX + key);
            if (!cached) return null;

            const { data, timestamp, ttl } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            // Check if expired
            if (age > ttl) {
                localStorage.removeItem(CACHE_PREFIX + key);
                return null;
            }

            return {
                data,
                age: Math.floor(age / 1000) // Return age in seconds
            };
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    },

    /**
     * Remove a specific cache entry
     * @param {string} key - Cache key to remove
     */
    invalidate(key) {
        try {
            localStorage.removeItem(CACHE_PREFIX + key);
        } catch (error) {
            console.error('Error invalidating cache:', error);
        }
    },

    /**
     * Clear all cache entries with our prefix
     */
    clearAll() {
        try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
            keys.forEach(key => localStorage.removeItem(key));
            console.log(`Cleared ${keys.length} cache entries`);
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    },

    /**
     * Remove oldest 25% of cache entries to free up space
     */
    clearOldest() {
        try {
            const keys = Object.keys(localStorage)
                .filter(k => k.startsWith(CACHE_PREFIX))
                .map(k => {
                    try {
                        const data = JSON.parse(localStorage.getItem(k));
                        return { key: k, timestamp: data.timestamp || 0 };
                    } catch {
                        return { key: k, timestamp: 0 };
                    }
                })
                .sort((a, b) => a.timestamp - b.timestamp);

            // Remove oldest 25%
            const toRemove = Math.ceil(keys.length * 0.25);
            keys.slice(0, toRemove).forEach(({ key }) => {
                localStorage.removeItem(key);
            });

            console.log(`Cleared ${toRemove} oldest cache entries`);
        } catch (error) {
            console.error('Error clearing oldest entries:', error);
        }
    }
};
