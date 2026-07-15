import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    id: { type: String, default: () => Date.now().toString(), unique: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
