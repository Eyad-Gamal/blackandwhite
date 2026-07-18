# Implementation Plan: Performance Optimization

## Overview

This implementation plan addresses severe performance issues in the Black & White e-commerce website by implementing a comprehensive multi-layer caching strategy, database query optimization, and frontend loading improvements. The goal is to reduce page load time from 60+ seconds to under 3 seconds.

## Tasks

- [x] 1. Create Cache Service Module
  - Create a centralized in-memory caching service with TTL support, invalidation, and statistics tracking
  - CREATE `server/services/cacheService.js`
  - Implement CacheService class with Map-based storage
  - Support get/set/invalidate/clear operations
  - Track cache hits/misses for statistics
  - Implement TTL expiration logic (fresh < 300s, stale 300-600s, expired > 600s)
  - Add warmUp method for cache preloading
  - Support wildcard pattern invalidation (e.g., 'storefront:*')
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 8.1, 8.2_

- [x] 2. Add MongoDB Indexes
  - Create database indexes to optimize query performance for products and categories
  - CREATE `server/utils/createIndexes.js`
  - MODIFY `server/server.js`
  - Create compound index on products: { status: 1, order: 1, _id: 1 }
  - Create index on products: { categoryId: 1 }
  - Create index on products: { order: 1 }
  - Create index on categories: { order: 1 }
  - Call createIndexes() after MongoDB connection
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 3. Configure Database Connection Pooling
  - Optimize MongoDB connection management with proper pooling configuration
  - MODIFY `server/server.js`
  - Add minPoolSize: 10 and maxPoolSize: 50 to mongoose.connect options
  - Add socketTimeoutMS: 30000, serverSelectionTimeoutMS: 5000
  - Add maxIdleTimeMS: 10000, waitQueueTimeoutMS: 5000
  - Log pool configuration on successful connection
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 4. Implement Optimized Storefront API with Caching
  - Modify the /api/storefront-data endpoint to use multi-layer caching with stale-while-revalidate pattern
  - MODIFY `server/routes/api.routes.js`
  - Import cacheService and generate cache key based on requested fields
  - Check cache before database query
  - Return cached data with X-Cache-Status: HIT for fresh cache
  - Return stale data immediately with X-Cache-Status: STALE and trigger background refresh
  - Fetch from database on cache MISS and update cache
  - Add X-Response-Time header
  - Support optional 'fields' query parameter for selective data fetching
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 2.8, 8.1, 8.2, 8.3, 8.4_

- [x] 5. Add Cache Invalidation to Admin Endpoints
  - Implement cache invalidation when data is created, updated, or deleted through admin endpoints
  - MODIFY `server/routes/api.routes.js`
  - Add cacheService.invalidate('storefront:*') after product POST/PUT/DELETE
  - Add cacheService.invalidate('storefront:*') after category POST/PUT/DELETE
  - Add cacheService.invalidate('storefront:*') after settings/hero/overlay PUT
  - Log cache invalidation events
  - _Requirements: 2.5_

- [x] 6. Implement Cache Warming on Server Startup
  - Pre-populate cache when server starts to ensure first request is fast
  - MODIFY `server/server.js`
  - Create warmCache() async function
  - Fetch all storefront data after DB connection and cache using cacheService
  - Log success/failure with timing
  - Retry every 60 seconds if warming fails
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7. Create Image Optimization Utility
  - Build a utility to optimize Cloudinary image URLs with automatic format and quality settings
  - CREATE `src/utils/imageOptimizer.js`
  - Create optimizeImageUrl(url, options) function
  - Support context-specific width presets (grid: 600px, modal: 1200px, hero: 1920px)
  - Apply q_auto for quality optimization and f_auto for format optimization (WebP/AVIF)
  - Apply w_{width},c_limit for resizing
  - Insert transformations into Cloudinary URL path
  - Create getImagePriority(index) helper for fetchpriority
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.7_

- [x] 8. Create Client-Side Cache Utility
  - Implement localStorage-based caching with TTL and quota management
  - CREATE `src/utils/clientCache.js`
  - Create clientCache object with set/get/invalidate methods
  - Store data with timestamp and TTL in localStorage with prefix 'bw_cache_'
  - Default TTL: 300 seconds (5 minutes)
  - get() checks TTL and returns null if expired
  - Handle QuotaExceededError by clearing oldest 25% of entries
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7_

- [x] 9. Create Skeleton Loader Components
  - Build reusable skeleton screen components for loading states
  - CREATE `src/components/SkeletonLoader.jsx`
  - MODIFY `src/index.css`
  - Create ProductCardSkeleton component
  - Create HeroSkeleton component
  - Create ProductGridSkeleton component (renders multiple cards)
  - Add shimmer animation CSS and fade-in transition CSS
  - Use gradient background with animation
  - Match skeleton dimensions to actual components
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 10. Integrate Client-Side Caching in Storefront
  - Update Storefront component to use localStorage cache and eliminate unnecessary re-fetching
  - MODIFY `src/pages/Storefront.jsx`
  - Import clientCache utility and check clientCache.get('storefront') before API call
  - Use cached data if available and fresh
  - Save API response to clientCache after fetch
  - Remove i18n.language from useEffect dependency array
  - Add loading state management and error state with retry logic
  - Update toggleLanguage to not trigger re-fetch
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 11. Integrate Skeleton Loaders in Storefront UI
  - Replace loading delays with skeleton screens for better user experience
  - MODIFY `src/pages/Storefront.jsx`
  - Import skeleton components from SkeletonLoader.jsx
  - Add isLoading state variable
  - Show HeroSkeleton when loading and ProductGridSkeleton(count=8) when loading products
  - Wrap actual content in fade-in div
  - Transition from skeleton to content smoothly
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 12. Apply Image Optimization to All Product Images
  - Update all image rendering to use optimized Cloudinary URLs
  - MODIFY `src/pages/Storefront.jsx`
  - Import optimizeImageUrl and getImagePriority from imageOptimizer
  - Apply optimizeImageUrl to all product grid images with context: 'grid'
  - Apply optimizeImageUrl to modal images with context: 'modal'
  - Apply optimizeImageUrl to hero image with context: 'hero'
  - Add lazy loading to product grid images (loading="lazy")
  - Add fetchpriority="high" to first 4 products
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [~] 13. Optimize Admin Dashboard Image Usage
  - Apply image optimization to admin panel product images
  - MODIFY `src/pages/AdminDashboard.jsx`
  - Import optimizeImageUrl from imageOptimizer
  - Apply optimization to product thumbnail images in table
  - Use context: 'thumbnail' (300px)
  - Add to product modal preview images
  - _Requirements: 4.1, 4.2, 4.7_

- [ ] 14. Enhance API Compression Configuration
  - Optimize gzip compression settings for maximum efficiency
  - MODIFY `server/server.js`
  - Configure compression middleware with level: 6
  - Set threshold: 1024 (only compress > 1KB)
  - Keep existing compression() call but add options
  - Verify compression header is sent
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [~] 15. Create Health Check Endpoint
  - Build monitoring endpoint to expose system health and cache metrics
  - MODIFY `server/routes/api.routes.js`
  - Create GET /api/health endpoint
  - Return database connection status, cache statistics (hits, misses, hit rate, size)
  - Return memory usage (heap used/total), server uptime, and timestamp
  - Format response as JSON
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [~] 16. Add Error Handling and Retry Logic to Storefront
  - Implement robust error handling with user feedback and automatic retry
  - MODIFY `src/pages/Storefront.jsx`
  - Add error state variable and retryCount state variable
  - Wrap fetch in try-catch and check HTTP response status
  - Display error banner with message and add retry button in error UI
  - Implement automatic retry once after 1 second
  - Fall back to cached data on error if available
  - Clear error state on successful retry
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [~] 17. Add Performance Logging Middleware
  - Implement request timing and logging for monitoring response times
  - MODIFY `server/server.js`
  - Create performance logging middleware
  - Capture request start time and log response time on request completion
  - Log cache status from response headers
  - Warn if response time > 1000ms
  - Include request method, path, and status code
  - _Requirements: 10.1, 10.2, 10.3_

- [~] 18. Add Selective Data Fetching Support
  - Allow clients to request specific data collections to reduce payload size
  - MODIFY `server/routes/api.routes.js`
  - Parse 'fields' query parameter from request
  - Split comma-separated fields list
  - Conditionally fetch only requested collections
  - Create separate cache keys for different field combinations
  - Return only requested data in response
  - Default to all fields if parameter is missing
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [~] 19. Update AdminDashboard Client-Side Caching
  - Apply client-side caching to admin dashboard data fetching
  - MODIFY `src/pages/AdminDashboard.jsx`
  - Import clientCache utility
  - Check cache before fetching admin data
  - Use separate cache key: 'admin_dashboard'
  - Shorter TTL for admin data: 60 seconds
  - Clear cache after any admin action (create/update/delete)
  - Keep focus-based refresh for real-time updates
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [~] 20. Integration Testing and Performance Validation
  - Test the complete optimization implementation and verify performance targets are met
  - Measure initial page load time with Chrome DevTools
  - Verify cache hit rate reaches 90%+
  - Test database query times < 200ms
  - Measure API response compression ratios
  - Test with slow 3G network throttling
  - Verify skeleton screens appear immediately
  - Test language switching doesn't re-fetch
  - Validate cache invalidation on admin updates
  - Test error recovery and retry
  - Measure image load times and verify WebP/AVIF delivery
  - Test connection pool under load
  - Check memory usage stability
  - _Requirements: 1.5, 2.6, 3.6, 4.2, 5.4, 6.4, 10.1, 10.2, 12.1, 12.5_

## Notes

- Tasks 1-6 focus on backend caching infrastructure
- Tasks 7-13 focus on frontend optimization
- Tasks 14-19 are supporting enhancements
- Task 20 validates the entire implementation
- Backend tasks can be parallelized with frontend tasks
- Testing should be performed after each major phase

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2", "3", "7", "8", "9"] },
    { "id": 1, "tasks": ["4", "10"] },
    { "id": 2, "tasks": ["5", "6", "11", "12", "14", "17"] },
    { "id": 3, "tasks": ["13", "15", "16", "18", "19"] },
    { "id": 4, "tasks": ["20"] }
  ]
}
```
