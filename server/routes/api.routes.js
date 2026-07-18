import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Settings from '../models/Settings.js';
import Hero from '../models/Hero.js';
import Overlay from '../models/Overlay.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// --- Storefront Data ---
router.get('/storefront-data', async (req, res) => {
    try {
        const [products, categories, settings, hero, overlay] = await Promise.all([
            Product.find().sort({ order: 1 }),
            Category.find().sort({ order: 1 }),
            Settings.findOne(),
            Hero.findOne(),
            Overlay.findOne()
        ]);
        res.json({
            products,
            categories,
            settings: settings || {},
            hero: hero || {},
            overlay: overlay || {}
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
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
        res.status(201).json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate({id: req.params.id}, req.body, { new: true });
        res.json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findOneAndDelete({id: req.params.id});
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
            res.json(product);
        } else if (product.stock !== undefined) {
            // Deduct whatever is left or just go to 0
            product.stock = Math.max(0, product.stock - quantity);
            await product.save();
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
        res.status(201).json(category);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate({id: req.params.id}, req.body, { new: true });
        res.json(category);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        await Category.findOneAndDelete({id: req.params.id});
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
        const coupon = await Coupon.findOneAndUpdate({id: req.params.id}, req.body, { new: true });
        res.json(coupon);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/coupons/:id', async (req, res) => {
    try {
        await Coupon.findOneAndDelete({id: req.params.id});
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});


// --- Settings ---
router.get('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if(!settings) {
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
        res.json(settings);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- Hero ---
router.get('/hero', async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if(!hero) {
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
        res.json(hero);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- Overlay ---
router.get('/overlay', async (req, res) => {
    try {
        let overlay = await Overlay.findOne();
        if(!overlay) {
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
