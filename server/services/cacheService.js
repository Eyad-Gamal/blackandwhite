/**
 * CacheService - In-memory caching service with TTL support
 * 
 * Features:
 * - TTL-based expiration (fresh < 300s, stale 300-600s, expired > 600s)
 * - Cache statistics tracking (hits, misses, hit rate)
 * - Wildcard pattern invalidation
 * - Cache warming support
 * - Stale-while-revalidate pattern
 */

class CacheService {
    constructor() {
        this.cacheStore = new Map();
        this.stats = {
            hits: 0,
            misses: 0
        };
    }

    /**
     * Get data from cache
     * @param {string} key - Cache key
     * @returns {{ data: any, status: 'HIT'|'STALE'|'MISS', age: number }}
     */
    get(key) {
        const entry = this.cacheStore.get(key);

        if (!entry) {
            this.stats.misses++;
            return { data: null, status: 'MISS', age: 0 };
        }

        const now = Date.now();
        const age = Math.floor((now - entry.timestamp) / 1000); // age in seconds
        const ttl = entry.ttl;

        // Fresh: 0-300 seconds
        if (age < ttl) {
            this.stats.hits++;
            return { data: entry.data, status: 'HIT', age };
        }

        // Stale: 300-600 seconds (return data but mark as stale)
        if (age < ttl * 2) {
            this.stats.hits++;
            return { data: entry.data, status: 'STALE', age };
        }

        // Expired: > 600 seconds
        this.cacheStore.delete(key);
        this.stats.misses++;
        return { data: null, status: 'MISS', age };
    }

    /**
     * Set data in cache with TTL
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time-to-live in seconds (default: 300)
     */
    set(key, data, ttl = 300) {
        const entry = {
            data,
            timestamp: Date.now(),
            ttl
        };
        this.cacheStore.set(key, entry);
    }

    /**
     * Invalidate cache entries matching pattern
     * Supports wildcard patterns (e.g., 'storefront:*')
     * @param {string} pattern - Cache key pattern
     */
    invalidate(pattern) {
        if (pattern.includes('*')) {
            // Wildcard pattern matching
            const prefix = pattern.replace('*', '');
            const keysToDelete = [];

            for (const key of this.cacheStore.keys()) {
                if (key.startsWith(prefix)) {
                    keysToDelete.push(key);
                }
            }

            keysToDelete.forEach(key => this.cacheStore.delete(key));

            if (keysToDelete.length > 0) {
                console.log(`[Cache] Invalidated ${keysToDelete.length} entries matching pattern: ${pattern}`);
            }
        } else {
            // Exact match
            if (this.cacheStore.delete(pattern)) {
                console.log(`[Cache] Invalidated entry: ${pattern}`);
            }
        }
    }

    /**
     * Clear all cache entries
     */
    clear() {
        const size = this.cacheStore.size;
        this.cacheStore.clear();
        console.log(`[Cache] Cleared ${size} entries`);
    }

    /**
     * Warm up cache by pre-fetching data
     * @param {Function} fetchFunction - Async function that returns data to cache
     * @param {string} cacheKey - Cache key to store the data
     * @param {number} ttl - Time-to-live in seconds
     * @returns {Promise<void>}
     */
    async warmUp(fetchFunction, cacheKey, ttl = 300) {
        try {
            console.log(`[Cache] Warming up cache for key: ${cacheKey}`);
            const startTime = Date.now();

            const data = await fetchFunction();
            this.set(cacheKey, data, ttl);

            const duration = Date.now() - startTime;
            console.log(`[Cache] ✓ Cache warmed successfully in ${duration}ms`);
        } catch (error) {
            console.error(`[Cache] ✗ Cache warming failed:`, error.message);
            throw error;
        }
    }

    /**
     * Get cache statistics
     * @returns {{ hits: number, misses: number, hitRate: number, size: number }}
     */
    getStats() {
        const total = this.stats.hits + this.stats.misses;
        const hitRate = total === 0 ? 0 : (this.stats.hits / total);

        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitRate: Math.round(hitRate * 10000) / 100, // Percentage with 2 decimal places
            size: this.cacheStore.size
        };
    }
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;
