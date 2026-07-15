import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { 
        ar: { type: String, required: true },
        en: { type: String, default: '' }
    },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
