import mongoose from 'mongoose';

const overlaySchema = new mongoose.Schema({
    type: { type: String, default: 'gradient' },
    color: { type: String, default: '#080808' },
    opacity: { type: Number, default: 85 },
    textColor: { type: String, default: '#ffffff' }
}, { timestamps: true });

export default mongoose.model('Overlay', overlaySchema);
