import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['campus', 'branch', 'semester', 'section'],
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Ensure unique value per type
systemSettingSchema.index({ type: 1, value: 1 }, { unique: true });

export default mongoose.model('SystemSetting', systemSettingSchema);
