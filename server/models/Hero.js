import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    headline: {
        ar: { type: String, default: 'أزياء تعبر عنك' },
        en: { type: String, default: 'Fashion that expresses You' }
    },
    styledWord: {
        ar: { type: String, default: 'عنك' },
        en: { type: String, default: 'You' }
    },
    tagline: {
        ar: { type: String, default: 'الأناقة الحقيقية تكمن في التفاصيل، خامات فاخرة وتصاميم إبداعية.' },
        en: { type: String, default: 'True elegance lies in the details, luxurious materials and creative designs.' }
    },
    badge: {
        ar: { type: String, default: 'NEW ARRIVAL' },
        en: { type: String, default: 'NEW ARRIVAL' }
    },
    productLabel: {
        ar: { type: String, default: 'القطعة المميزة' },
        en: { type: String, default: 'Featured Item' }
    },
    heroPrice: { type: Number, default: 299 },
    image: { type: String, default: 'Gemini_Generated_Image_.png' },
    bgType: { type: String, enum: ['gradient', 'solid', 'transparent'], default: 'solid' },
    bgColor: { type: String, default: '#0a0a0a' },
    bgOpacity: { type: Number, default: 100 }
}, { timestamps: true });

export default mongoose.model('Hero', heroSchema);
