# Design Document

## Overview

This document provides the technical design for optimizing the Black & White e-commerce website performance. The design focuses on implementing a multi-layer caching strategy, database query optimization, image delivery improvements, and progressive UI loading patterns to reduce page load time from 60+ seconds to under 3 seconds.

## System Architecture

### Current Architecture
```
[Browser] --HTTP--> [Express Server] --Query--> [MongoDB Atlas] --Network--> [Data]
                                              |
                                              v
                                          [Cloudinary CDN] --Images--> [Browser]
```

### Optimized Architecture
```
[Browser + localStorage Cache]
    |
    | HTTP Request
    v
[Express Server]
    |
    ├─> [In-Memory Cache Layer] --Cache Hit--> [Response]
    |       |
    |       | Cache Miss
    |       v
    ├─> [Connection Pool (10-50)] --Query--> [MongoDB Atlas + Indexes]
    |
    └─> [Compression Middleware (gzip)]
    
[Cloudinary CDN] --Optimized Images (WebP/AVIF, resized)--> [Browser]
```

## Component Design

### 1. Cache Layer Service

**File**: `server/services/cacheService.js` (new file)

**Purpose**: Centralized in-memory caching with TTL, invalidation, and stale-while-revalidate support

**Interface**:
```javascript
class CacheService {
  constructor()
  get(key: string): { data: any, status: 'HIT' | 'STALE' | 'MISS', age: number }
  set(key: string, data: any, ttl: number): void
  invalidate(pattern: string): void
  clear(): void
  warmUp(fetchFunction: Function): Promise<void>
  getStats(): { hits: number, misses: number, hitRate: number }
}
```

**Data Structure**:
```javascript
{
  cacheStore: Map<string, CacheEntry>
  stats: { hits: 0, misses: 0 }
}

CacheEntry {
  data: any
  timestamp: number  // Unix timestamp in ms
  ttl: number        // TTL in seconds
}
```

**TTL Strategy**:
- Fresh: 0-300 seconds (5 minutes) → Cache HIT
- Stale: 300-600 seconds → Cache STALE (return immediately + background refresh)
- Expired: >600 seconds → Cache MISS (synchronous fetch)

### 2. Database Indexes

**File**: `server/utils/createIndexes.js` (new file)

**Indexes to Create**:

```javascript
// Products Collection
db.products.createIndex({ status: 1, order: 1, _id: 1 })  // Compound index for sorted queries
db.products.createIndex({ categoryId: 1 })                 // Category filtering
db.products.createIndex({ order: 1 })                      // Sorting optimization

// Categories Collection
db.categories.createIndex({ order: 1 })                    // Sorting optimization

// Settings Collection
// Single document - no index needed

// Hero Collection  
// Single document - no index needed

// Overlay Collection
// Single document - no index needed
```

**Index Creation Strategy**:
- Run on server startup
- Check if index exists before creating
- Log index creation status
- Handle errors gracefully

### 3. Modified API Routes

**File**: `server/routes/api.routes.js` (modified)

**Changes to `/api/storefront-data`**:

```javascript
router.get('/storefront-data', async (req, res) => {
  const startTime = Date.now()
  const fields = req.query.fields?.split(',') || ['products', 'categories', 'settings', 'hero', 'overlay']
  const cacheKey = `storefront:${fields.sort().join(',')}`
  
  // 1. Check cache
  const cached = cacheService.get(cacheKey)
  
  if (cached.status === 'HIT') {
    res.setHeader('X-Cache-Status', 'HIT')
    res.setHeader('X-Cache-Age', cached.age)
    return res.json(cached.data)
  }
  
  if (cached.status === 'STALE') {
    res.setHeader('X-Cache-Status', 'STALE')
    res.setHeader('X-Cache-Age', cached.age)
    
    // Background refresh (fire and forget)
    fetchAndCacheData(cacheKey, fields).catch(err => console.error(err))
    
    return res.json(cached.data)
  }
  
  // 2. Cache MISS - fetch from database
  try {
    const data = await fetchStorefrontData(fields)
    cacheService.set(cacheKey, data, 300)  // 5 minutes TTL
    
    res.setHeader('X-Cache-Status', 'MISS')
    res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`)
    res.json(data)
  } catch (err) {
    // Fallback to stale cache if available
    if (cached.data) {
      res.setHeader('X-Cache-Status', 'FALLBACK')
      return res.json(cached.data)
    }
    res.status(500).json({ message: err.message })
  }
})
```

**Cache Invalidation on Data Changes**:

```javascript
// After product create/update/delete
router.post('/products', async (req, res) => {
  // ... create product ...
  cacheService.invalidate('storefront:*')  // Invalidate all storefront caches
  res.status(201).json(product)
})

// Similar for categories, settings, hero, overlay endpoints
```


### 4. Image Optimization

**File**: `src/utils/imageOptimizer.js` (new file)

**Purpose**: Centralized image URL transformation for Cloudinary

**Implementation**:

```javascript
export const optimizeImageUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url
  
  const { width = 600, quality = 'auto', format = 'auto', context = 'grid' } = options
  
  // Context-specific defaults
  const contextWidths = {
    grid: 600,       // Product grid thumbnails
    modal: 1200,     // Product detail modal
    hero: 1920,      // Hero section images
    thumbnail: 300   // Small thumbnails
  }
  
  const targetWidth = contextWidths[context] || width
  
  // Build transformation string
  const transformations = `q_${quality},f_${format},w_${targetWidth},c_limit`
  
  // Insert transformations into Cloudinary URL
  return url.replace('/upload/', `/upload/${transformations}/`)
}

export const getImagePriority = (index, total) => {
  // First 4 images get high priority
  return index < 4 ? 'high' : 'auto'
}
```

**Usage in Components**:

```javascript
// In Storefront.jsx
<img 
  src={optimizeImageUrl(product.images[0], { context: 'grid' })} 
  alt={product.name}
  loading={index < 4 ? 'eager' : 'lazy'}
  fetchpriority={getImagePriority(index, products.length)}
/>
```

### 5. Client-Side Caching

**File**: `src/utils/clientCache.js` (new file)

**Purpose**: Browser-side caching using localStorage with TTL

**Implementation**:

```javascript
const CACHE_PREFIX = 'bw_cache_'
const DEFAULT_TTL = 300 // 5 minutes in seconds

export const clientCache = {
  set(key, data, ttl = DEFAULT_TTL) {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: ttl * 1000 // Convert to ms
      }
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry))
    } catch (error) {
      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        this.clearOldest()
        this.set(key, data, ttl) // Retry
      }
    }
  },
  
  get(key) {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key)
      if (!cached) return null
      
      const { data, timestamp, ttl } = JSON.parse(cached)
      const age = Date.now() - timestamp
      
      if (age > ttl) {
        localStorage.removeItem(CACHE_PREFIX + key)
        return null
      }
      
      return { data, age: Math.floor(age / 1000) }
    } catch {
      return null
    }
  },
  
  invalidate(key) {
    localStorage.removeItem(CACHE_PREFIX + key)
  },
  
  clearOldest() {
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .map(k => {
        const data = JSON.parse(localStorage.getItem(k))
        return { key: k, timestamp: data.timestamp }
      })
      .sort((a, b) => a.timestamp - b.timestamp)
    
    // Remove oldest 25%
    const toRemove = Math.ceil(keys.length * 0.25)
    keys.slice(0, toRemove).forEach(({ key }) => localStorage.removeItem(key))
  }
}
```

**Integration in Storefront.jsx**:

```javascript
useEffect(() => {
  async function fetchData() {
    // Check client cache first
    const cached = clientCache.get('storefront')
    if (cached) {
      setProducts(cached.data.products || [])
      setCategories(cached.data.categories || [])
      setSettings(cached.data.settings || {})
      setHero(cached.data.hero || {})
      setOverlay(cached.data.overlay || {})
      setIsLoading(false)
      return
    }
    
    // Fetch from API
    setIsLoading(true)
    try {
      const res = await fetch('/api/storefront-data')
      const data = await res.json()
      
      // Update state
      setProducts(data.products || [])
      // ... set other state
      
      // Cache for next time
      clientCache.set('storefront', data)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  fetchData()
}, []) // Remove i18n.language dependency!

// Language change should NOT re-fetch
const toggleLanguage = () => {
  const newLang = i18n.language === 'en' ? 'ar' : 'en'
  i18n.changeLanguage(newLang)
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  // Data is already loaded - just re-render with new language
}
```


### 6. Loading States & Skeleton Screens

**File**: `src/components/SkeletonLoader.jsx` (new file)

**Purpose**: Reusable skeleton components for loading states

**Components**:

```javascript
export const ProductCardSkeleton = () => (
  <div className="product-card skeleton-card">
    <div className="skeleton skeleton-image" style={{ height: '300px' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px', marginTop: '12px' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '80%', height: '20px', marginTop: '8px' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '40%', height: '24px', marginTop: '12px' }}></div>
  </div>
)

export const HeroSkeleton = () => (
  <section className="hero skeleton-hero">
    <div className="hero-content">
      <div className="hero-text">
        <div className="skeleton skeleton-text" style={{ width: '200px', height: '40px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '80%', height: '60px', marginTop: '20px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '20px', marginTop: '12px' }}></div>
      </div>
      <div className="hero-visual">
        <div className="skeleton skeleton-image" style={{ width: '100%', height: '500px' }}></div>
      </div>
    </div>
  </section>
)

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="products-grid">
    {Array(count).fill(null).map((_, idx) => (
      <ProductCardSkeleton key={idx} />
    ))}
  </div>
)
```

**CSS** (add to `src/index.css`):

```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 4/3;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Usage in Storefront.jsx**:

```javascript
import { HeroSkeleton, ProductGridSkeleton } from '../components/SkeletonLoader'

return (
  <>
    {isLoading ? (
      <>
        <HeroSkeleton />
        <section className="products-section">
          <ProductGridSkeleton count={8} />
        </section>
      </>
    ) : (
      <div className="fade-in">
        {/* Actual content */}
        <section className="hero">...</section>
        <section className="products-section">...</section>
      </div>
    )}
  </>
)
```

### 7. Database Connection Pooling

**File**: `server/server.js` (modified)

**Configuration**:

```javascript
mongoose.connect(MONGO_URI, {
  family: 4,
  // Connection Pool Settings
  minPoolSize: 10,           // Minimum connections
  maxPoolSize: 50,           // Maximum connections
  socketTimeoutMS: 30000,    // 30 seconds
  serverSelectionTimeoutMS: 5000,
  // Performance optimizations
  maxIdleTimeMS: 10000,      // Close idle connections after 10s
  waitQueueTimeoutMS: 5000   // Wait 5s for available connection
})
.then(() => {
  console.log('Connected to MongoDB with pool:', {
    min: 10,
    max: 50
  })
})
.catch(err => console.error('MongoDB connection error:', err))

// Monitor pool stats (optional)
mongoose.connection.on('connected', () => {
  setInterval(() => {
    const pool = mongoose.connection.db.serverConfig.s.pool
    console.log('Pool Stats:', {
      available: pool.availableConnections?.length || 0,
      inUse: pool.inUseConnections?.length || 0
    })
  }, 60000) // Log every minute
})
```

### 8. Cache Warming

**File**: `server/server.js` (modified)

**Implementation**:

```javascript
import { cacheService } from './services/cacheService.js'

async function warmCache() {
  console.log('Warming cache...')
  try {
    const startTime = Date.now()
    
    // Fetch all storefront data
    const data = await fetchStorefrontData(['products', 'categories', 'settings', 'hero', 'overlay'])
    
    // Cache it
    cacheService.set('storefront:categories,hero,overlay,products,settings', data, 300)
    
    console.log(`✓ Cache warmed in ${Date.now() - startTime}ms`)
  } catch (error) {
    console.error('✗ Cache warming failed:', error.message)
    // Retry after 60 seconds
    setTimeout(warmCache, 60000)
  }
}

// Warm cache after DB connection
mongoose.connect(MONGO_URI, { /* ... */ })
  .then(() => {
    console.log('Connected to MongoDB')
    warmCache() // Warm cache immediately
  })
```


### 9. Response Compression

**File**: `server/server.js` (modified)

**Current State**: Already has `compression` middleware

**Optimization**:

```javascript
import compression from 'compression';

// Configure compression with optimal settings
app.use(compression({
  level: 6,              // Compression level (0-9), 6 is balanced
  threshold: 1024,       // Only compress responses > 1KB
  filter: (req, res) => {
    // Compress all JSON responses
    if (req.headers['x-no-compression']) return false
    return compression.filter(req, res)
  }
}))
```

**Expected Results**:
- `/api/storefront-data` response: ~150KB → ~40KB (73% reduction)
- All JSON API responses compressed
- No compression for already-compressed formats (images, video)

### 10. Health Check Endpoint

**File**: `server/routes/api.routes.js` (modified)

**New Endpoint**: `/api/health`

```javascript
router.get('/health', (req, res) => {
  const cacheStats = cacheService.getStats()
  const dbState = mongoose.connection.readyState
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting']
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStates[dbState],
      connected: dbState === 1
    },
    cache: {
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.hitRate,
      size: cacheStats.size
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    },
    uptime: Math.floor(process.uptime()) + ' seconds'
  })
})
```

### 11. Error Handling & Fallback

**File**: `src/pages/Storefront.jsx` (modified)

**Implementation**:

```javascript
const [error, setError] = useState(null)
const [retryCount, setRetryCount] = useState(0)

async function fetchData() {
  try {
    setError(null)
    
    // Check client cache first
    const cached = clientCache.get('storefront')
    if (cached) {
      // Use cached data
      updateStateFromData(cached.data)
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    const res = await fetch('/api/storefront-data')
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    
    const data = await res.json()
    updateStateFromData(data)
    clientCache.set('storefront', data)
    setRetryCount(0)
    
  } catch (e) {
    console.error("API Error:", e)
    setError(e.message)
    
    // Retry once after 1 second
    if (retryCount === 0) {
      setRetryCount(1)
      setTimeout(() => fetchData(), 1000)
    }
  } finally {
    setIsLoading(false)
  }
}

// Error UI
{error && (
  <div className="error-banner" style={{
    background: 'var(--danger-bg)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    padding: '16px',
    borderRadius: '8px',
    margin: '20px',
    textAlign: 'center'
  }}>
    <i className="fa-solid fa-circle-exclamation"></i> {error}
    <button 
      onClick={() => { setError(null); fetchData(); }} 
      style={{ marginLeft: '12px', padding: '8px 16px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
    >
      إعادة المحاولة
    </button>
  </div>
)}
```

## Data Flow Diagrams

### Optimized Request Flow

```
User loads page
    |
    v
Check localStorage cache
    |
    ├─> Cache HIT (< 5min) ──────────> Render immediately
    |                                         |
    └─> Cache MISS                            v
        |                              Show content (cached)
        v
    Show skeleton screens
        |
        v
    Fetch /api/storefront-data
        |
        v
    Check server cache
        |
        ├─> Cache HIT ──────> Return data + X-Cache-Status: HIT
        |
        ├─> Cache STALE ────> Return stale + async refresh + X-Cache-Status: STALE
        |
        └─> Cache MISS ─────> Query MongoDB with indexes
                                   |
                                   v
                              Return data + cache it + X-Cache-Status: MISS
                                   |
                                   v
                              Compress response (gzip 70%+)
                                   |
                                   v
                              Send to browser
                                   |
                                   v
                              Update localStorage
                                   |
                                   v
                              Render content (fade-in)
```

### Cache Invalidation Flow

```
Admin updates product
    |
    v
POST /api/products
    |
    ├─> Save to MongoDB
    |
    └─> cacheService.invalidate('storefront:*')
            |
            v
        Clear all storefront cache entries
            |
            v
        Next user request → Cache MISS → Fresh data
```

## Performance Targets

| Metric | Current | Target | Strategy |
|--------|---------|--------|----------|
| Initial Page Load | 60+ seconds | < 3 seconds | Multi-layer caching + indexes |
| Database Query Time | ~5-10 seconds | < 200ms | Indexes + connection pooling |
| API Response Size | ~150KB | ~40KB | gzip compression |
| Cache Hit Rate | 0% | > 90% | Server + client caching |
| Image Load Time | 2-5 seconds | < 1 second | Cloudinary optimization |
| Language Switch | Full reload | Instant | Client-side cache |
| Time to First Byte | 3-8 seconds | < 500ms | Cache warming |

## Implementation Order

1. **Phase 1: Backend Foundation** (Highest Priority)
   - Create cache service
   - Add database indexes
   - Configure connection pooling
   - Implement cache warming

2. **Phase 2: API Optimization**
   - Modify `/api/storefront-data` with caching
   - Add cache invalidation to all mutating endpoints
   - Add health check endpoint
   - Optimize compression settings

3. **Phase 3: Frontend Optimization**
   - Implement client-side caching
   - Create skeleton loader components
   - Fix language change re-fetching
   - Add error handling UI

4. **Phase 4: Image Optimization**
   - Create image optimizer utility
   - Update all image URLs
   - Add lazy loading + fetchpriority
   - Test WebP/AVIF delivery

5. **Phase 5: Testing & Monitoring**
   - Verify cache hit rates
   - Test loading states
   - Measure performance improvements
   - Monitor production metrics

## Testing Strategy

### Performance Testing
- Measure page load time before/after (Chrome DevTools Performance tab)
- Test cache hit/miss scenarios
- Verify database query execution plans
- Check compression ratios
- Test with slow 3G network throttling

### Functional Testing
- Verify data consistency with caching
- Test cache invalidation on admin updates
- Test language switching without re-fetching
- Verify skeleton screens display correctly
- Test error recovery and retry logic

### Load Testing
- Simulate 100 concurrent users
- Verify connection pool handles load
- Check cache performance under load
- Monitor memory usage with caching

