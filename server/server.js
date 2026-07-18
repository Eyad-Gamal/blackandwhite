import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import apiRoutes from './routes/api.routes.js';

// Database utilities
import { createIndexes } from './utils/createIndexes.js';

// Cache and Models for warming
import { cacheService } from './services/cacheService.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Settings from './models/Settings.js';
import Hero from './models/Hero.js';
import Overlay from './models/Overlay.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
// Performance Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const cacheStatus = res.getHeader('X-Cache-Status') || 'NONE';
        const timestamp = new Date().toISOString();
        const logMsg = `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${cacheStatus}`;

        if (duration > 1000) {
            console.warn(`[WARN] SLOW REQUEST: ${logMsg}`);
        } else {
            console.log(logMsg);
        }
    });
    next();
});
app.use(compression({
    level: 6,
    threshold: 1024
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cache Warming Function
async function warmCache(retryCount = 0) {
    try {
        console.log('[Startup] Warming up storefront cache...');
        const startTime = Date.now();

        // Set longer timeout for cache warming queries
        const [products, categories, settings, hero, overlay] = await Promise.all([
            Product.find().sort({ order: 1 }).maxTimeMS(20000).lean(),
            Category.find().sort({ order: 1 }).maxTimeMS(20000).lean(),
            Settings.findOne().maxTimeMS(20000).lean(),
            Hero.findOne().maxTimeMS(20000).lean(),
            Overlay.findOne().maxTimeMS(20000).lean()
        ]);

        const data = {
            products,
            categories,
            settings: settings || {},
            hero: hero || {},
            overlay: overlay || {}
        };
        const fields = ['products', 'categories', 'settings', 'hero', 'overlay'];
        const cacheKey = `storefront:${fields.sort().join(',')}`;
        cacheService.set(cacheKey, data, 300);
        console.log(`[Startup] ✓ Cache warmed successfully in ${Date.now() - startTime}ms`);
    } catch (err) {
        console.error('[Startup] ✗ Cache warming failed:', err.message);
        if (retryCount < 3) {
            const delay = Math.min(10000 * Math.pow(2, retryCount), 60000); // Exponential backoff: 10s, 20s, 40s
            console.log(`[Startup] Retrying in ${delay / 1000}s... (attempt ${retryCount + 1}/3)`);
            setTimeout(() => warmCache(retryCount + 1), delay);
        } else {
            console.warn('[Startup] Cache warming failed after 3 attempts. API will fetch fresh data on first request.');
        }
    }
}

// Database connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI, {
        family: 4,
        // Connection Pool Settings - Optimized for very slow connections
        minPoolSize: 2,            // Minimal pool to reduce connection overhead
        maxPoolSize: 10,           // Smaller pool for stability
        socketTimeoutMS: 180000,   // 180 seconds (3 minutes) for extremely slow connections
        serverSelectionTimeoutMS: 20000,  // 20 seconds to select server
        connectTimeoutMS: 30000,   // 30 seconds to establish connection
        // Performance optimizations
        maxIdleTimeMS: 60000,      // Keep connections alive for 60s
        waitQueueTimeoutMS: 15000, // Wait 15s for available connection
        // Connection retry
        retryWrites: true,
        retryReads: true
    })
        .then(async () => {
            console.log('✓ Connected to MongoDB with pool:', {
                min: 2,
                max: 10
            });
            // Create indexes in background (non-blocking)
            createIndexes().catch(err => console.error('Index creation failed:', err));

            // Skip cache warming - let first request populate the cache
            console.log('💡 Cache will be populated on first API request (lazy loading)');
        })
        .catch(err => console.error('✗ MongoDB connection error:', err));
} else {
    console.warn('⚠ MONGO_URI is missing from .env');
}

// API Routes setup
app.use('/api', apiRoutes);

// Serve Static Frontend
const PUBLIC_DIR = path.resolve(__dirname, '../dist');

app.use(express.static(PUBLIC_DIR, {
    maxAge: '1y',
    etag: true
}));

app.get(/^.*$/, (req, res) => {
    res.sendFile(path.resolve(PUBLIC_DIR, 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;


// Restart
