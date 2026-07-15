import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    whatsappNumber: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    tiktokUrl: { type: String, default: '' },
    announcements: { 
        type: [{
            text: { ar: String, en: String },
            icon: String
        }],
        default: [
            { text: { ar: 'توصيل مجاني للطلبات فوق 500 ج.م', en: 'Free delivery for orders over 500 EGP' }, icon: 'fa-solid fa-truck-fast' },
            { text: { ar: 'إطلاق الكوليكشن الأول من Black & White', en: 'Launch of the first Black & White collection' }, icon: 'fa-solid fa-star' },
            { text: { ar: 'استبدال مجاني خلال 7 أيام', en: 'Free returns within 7 days' }, icon: 'fa-solid fa-rotate-left' },
            { text: { ar: 'مضمون 100٪ جودة أصلية', en: '100% Original quality guaranteed' }, icon: 'fa-solid fa-shield-halved' }
        ]
    }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
