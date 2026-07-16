import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { 
        ar: { type: String, required: true },
        en: { type: String, default: '' }
    },
    categoryId: { type: String, required: true },
    basePrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    prices: { type: Object, default: {} },
    sizes: [{
        size: String,
        price: Number
    }],
    tag: { type: String, default: '' },
    mainImage: { type: String },
    images: [{ type: String }],
    status: { type: String, default: 'active' },
    isNewArrival: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

export default mongoose.model('Product', productSchema);
