import express from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Settings from '../models/Settings.js';
import Hero from '../models/Hero.js';
import Overlay from '../models/Overlay.js';
import Coupon from '../models/Coupon.js';
import { cacheService } from '../services/cacheService.js';

const router = express.Router();

/**
 * Fetch storefront data from database
 * @param {string[]} fields - Array of field names to fetch
 * @returns {Promise<object>} Storefront data object
 */
async function fetchStorefrontData(fields) {
    const data = {};
    const fetchPromises = [];

    // Add timeout and lean() for better performance
    const QUERY_TIMEOUT = 150000; // 150 seconds (2.5 minutes) for extremely slow MongoDB Atlas connections

    if (fields.includes('products')) {
        fetchPromises.push(
            Product.find().sort({ order: 1 }).maxTimeMS(QUERY_TIMEOUT).lean()
                .then(result => { data.products = result; })
                .catch(err => {
                    console.error('[DB] Products fetch failed:', err.message);
                    data.products = [];
                })
        );
    }
    if (fields.includes('categories')) {
        fetchPromises.push(
            Category.find().sort({ order: 1 }).maxTimeMS(QUERY_TIMEOUT).lean()
                .then(result => { data.categories = result; })
                .catch(err => {
                    console.error('[DB] Categories fetch failed:', err.message);
                    data.categories = [];
                })
        );
    }
    if (fields.includes('settings')) {
        fetchPromises.push(
            Settings.findOne().maxTimeMS(QUERY_TIMEOUT).lean()
                .then(result => { data.settings = result || {}; })
                .catch(err => {
                    console.error('[DB] Settings fetch failed:', err.message);
                    data.settings = {};
                })
        );
    }
    if (fields.includes('hero')) {
        fetchPromises.push(
            Hero.findOne().maxTimeMS(QUERY_TIMEOUT).lean()
                .then(result => { data.hero = result || {}; })
                .catch(err => {
                    console.error('[DB] Hero fetch failed:', err.message);
                    data.hero = {};
                })
        );
    }
    if (fields.includes('overlay')) {
        fetchPromises.push(
            Overlay.findOne().maxTimeMS(QUERY_TIMEOUT).lean()
                .then(result => { data.overlay = result || {}; })
                .catch(err => {
                    console.error('[DB] Overlay fetch failed:', err.message);
                    data.overlay = {};
                })
        );
    }

    await Promise.allSettled(fetchPromises);
    return data;
}

/**
 * Fetch and cache storefront data (used for background refresh)
 */
async function fetchAndCacheData(cacheKey, fields) {
    const data = await fetchStorefrontData(fields);
    cacheService.set(cacheKey, data, 300);
    return data;
}

// --- Storefront Data ---
router.get('/storefront-data', async (req, res) => {
    const startTime = Date.now();

    // Parse fields parameter or use all fields by default
    const fields = req.query.fields
        ? req.query.fields.split(',').map(f => f.trim())
        : ['products', 'categories', 'settings', 'hero', 'overlay'];

    // Generate cache key based on fields
    const cacheKey = `storefront:${fields.sort().join(',')}`;

    // Check cache
    const cached = cacheService.get(cacheKey);

    if (cached.status === 'HIT') {
        res.setHeader('X-Cache-Status', 'HIT');
        res.setHeader('X-Cache-Age', cached.age.toString());
        res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);
        return res.json(cached.data);
    }

    if (cached.status === 'STALE') {
        res.setHeader('X-Cache-Status', 'STALE');
        res.setHeader('X-Cache-Age', cached.age.toString());
        res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);

        // Background refresh (fire and forget)
        fetchAndCacheData(cacheKey, fields).catch(err =>
            console.error('[Cache] Background refresh failed:', err.message)
        );

        return res.json(cached.data);
    }

    // Cache MISS - fetch from database
    try {
        const data = await fetchStorefrontData(fields);
        cacheService.set(cacheKey, data, 300); // 5 minutes TTL

        res.setHeader('X-Cache-Status', 'MISS');
        res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);
        res.json(data);
    } catch (err) {
        console.error('[API] Storefront data fetch error:', err.message);

        // Fallback to stale cache if available
        if (cached.data) {
            res.setHeader('X-Cache-Status', 'FALLBACK');
            res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);
            return res.json(cached.data);
        }

        res.status(500).json({ message: err.message });
    }
});

// --- Health Check Endpoint ---
router.get('/health', (req, res) => {
    try {
        const memoryUsage = process.memoryUsage();
        const cacheStats = cacheService.getStats();

        const healthData = {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: {
                status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
                readyState: mongoose.connection.readyState
            },
            cache: {
                ...cacheStats,
                hitRate: cacheStats.hits + cacheStats.misses > 0
                    ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(2) + '%'
                    : '0%'
            },
            memory: {
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB'
            }
        };

        res.status(200).json(healthData);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// --- Products ---
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ order: 1 });
        res.json(products);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();

        // Invalidate storefront cache
        cacheService.invalidate('storefront:*');

        res.status(201).json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        cacheService.invalidate('storefront:*');
        res.json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.params.id });
        cacheService.invalidate('storefront:*');
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/products/:id/decrease-stock', async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findOne({ id: req.params.id });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.stock && product.stock >= quantity) {
            product.stock -= quantity;
            await product.save();
            cacheService.invalidate('storefront:*');
            res.json(product);
        } else if (product.stock !== undefined) {
            // Deduct whatever is left or just go to 0
            product.stock = Math.max(0, product.stock - quantity);
            await product.save();
            cacheService.invalidate('storefront:*');
            res.json(product);
        } else {
            res.json(product); // No stock tracking
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Categories ---
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.json(categories);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        cacheService.invalidate('storefront:*');
        res.status(201).json(category);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        cacheService.invalidate('storefront:*');
        res.json(category);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        await Category.findOneAndDelete({ id: req.params.id });
        cacheService.invalidate('storefront:*');
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Coupons ---
router.post('/coupons/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
        if (!coupon) return res.status(404).json({ message: 'كود خصم غير صالح أو منتهي الصلاحية' });
        res.json(coupon);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/coupons', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/coupons', async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/coupons/:id', async (req, res) => {
    try {
        const coupon = await Coupon.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(coupon);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/coupons/:id', async (req, res) => {
    try {
        await Coupon.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});


// --- Settings ---
router.get('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
            await settings.save();
        }
        res.json(settings);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (settings) {
            settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
        } else {
            settings = new Settings(req.body);
            await settings.save();
        }
        cacheService.invalidate('storefront:*');
        res.json(settings);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- Hero ---
router.get('/hero', async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) {
            hero = new Hero({});
            await hero.save();
        }
        res.json(hero);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/hero', async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (hero) {
            hero = await Hero.findByIdAndUpdate(hero._id, req.body, { new: true });
        } else {
            hero = new Hero(req.body);
            await hero.save();
        }
        cacheService.invalidate('storefront:*');
        res.json(hero);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- Overlay ---
router.get('/overlay', async (req, res) => {
    try {
        let overlay = await Overlay.findOne();
        if (!overlay) {
            overlay = new Overlay({});
            await overlay.save();
        }
        res.json(overlay);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/overlay', async (req, res) => {
    try {
        let overlay = await Overlay.findOne();
        if (overlay) {
            overlay = await Overlay.findByIdAndUpdate(overlay._id, req.body, { new: true });
        } else {
            overlay = new Overlay(req.body);
            await overlay.save();
        }
        cacheService.invalidate('storefront:*');
        res.json(overlay);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- Upload ---
router.post('/upload', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ message: 'لم يتم توفير صورة' });

        // Cloudinary SDK automatically picks up process.env.CLOUDINARY_URL
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'black_and_white'
        });

        res.json({ url: uploadResponse.secure_url });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: err.message || 'فشل في رفع الصورة' });
    }
});

export default router;
