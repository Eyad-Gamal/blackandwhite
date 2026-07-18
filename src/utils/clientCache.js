const CACHE_PREFIX = 'bw_cache_';
const DEFAULT_TTL = 300; // 5 minutes in seconds

// Check if localStorage is available (may be blocked by Tracking Prevention)
const isLocalStorageAvailable = () => {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

// In-memory fallback cache when localStorage is blocked
const memoryCache = new Map();

/**
 * Client-side caching utility using localStorage with TTL and quota management
 * Falls back to in-memory cache if localStorage is blocked by Tracking Prevention
 */
export const clientCache = {
    /**
     * Store data in localStorage or memory with TTL
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in seconds (default: 300s)
     */
    set(key, data, ttl = DEFAULT_TTL) {
        const cacheEntry = {
            data,
            timestamp: Date.now(),
            ttl: ttl * 1000 // Convert to milliseconds
        };

        if (!isLocalStorageAvailable()) {
            // Use in-memory cache as fallback
            memoryCache.set(CACHE_PREFIX + key, cacheEntry);
            return;
        }

        try {
            localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
        } catch (error) {
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded, clearing oldest entries...');
                this.clearOldest();
                // Retry after clearing
                try {
                    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
                } catch (retryError) {
                    console.error('Failed to cache data after cleanup, using memory cache');
                    memoryCache.set(CACHE_PREFIX + key, cacheEntry);
                }
            } else {
                console.error('Error caching data, using memory cache:', error);
                memoryCache.set(CACHE_PREFIX + key, cacheEntry);
            }
        }
    },

    /**
     * Retrieve data from localStorage or memory
     * @param {string} key - Cache key
     * @returns {object|null} { data, age } or null if expired/missing
     */
    get(key) {
        const fullKey = CACHE_PREFIX + key;

        // Try memory cache first
        if (memoryCache.has(fullKey)) {
            const { data, timestamp, ttl } = memoryCache.get(fullKey);
            const age = Date.now() - timestamp;

            if (age > ttl) {
                memoryCache.delete(fullKey);
                return null;
            }

            return {
                data,
                age: Math.floor(age / 1000)
            };
        }

        // Try localStorage
        if (!isLocalStorageAvailable()) {
            return null;
        }

        try {
            const cached = localStorage.getItem(fullKey);
            if (!cached) return null;

            const { data, timestamp, ttl } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            // Check if expired
            if (age > ttl) {
                localStorage.removeItem(fullKey);
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
        const fullKey = CACHE_PREFIX + key;
        memoryCache.delete(fullKey);

        if (!isLocalStorageAvailable()) return;

        try {
            localStorage.removeItem(fullKey);
        } catch (error) {
            console.error('Error invalidating cache:', error);
        }
    },

    /**
     * Clear all cache entries with our prefix
     */
    clearAll() {
        // Clear memory cache
        for (const key of memoryCache.keys()) {
            if (key.startsWith(CACHE_PREFIX)) {
                memoryCache.delete(key);
            }
        }

        if (!isLocalStorageAvailable()) return;

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
        if (!isLocalStorageAvailable()) return;

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
