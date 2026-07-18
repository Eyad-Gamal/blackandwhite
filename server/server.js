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
async function warmCache() {
    try {
        console.log('[Startup] Warming up storefront cache...');
        const startTime = Date.now();
        const [products, categories, settings, hero, overlay] = await Promise.all([
            Product.find().sort({ order: 1 }),
            Category.find().sort({ order: 1 }),
            Settings.findOne(),
            Hero.findOne(),
            Overlay.findOne()
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
        console.log(`[Startup] Cache warmed successfully in ${Date.now() - startTime}ms`);
    } catch (err) {
        console.error('[Startup] Cache warming failed, retrying in 60s...', err.message);
        setTimeout(warmCache, 60000);
    }
}

// Database connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
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
        .then(async () => {
            console.log('Connected to MongoDB with pool:', {
                min: 10,
                max: 50
            });
            // Create indexes after connection
            await createIndexes();
            // Warm cache
            warmCache();
        })
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.warn('MONGO_URI is missing from .env');
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
