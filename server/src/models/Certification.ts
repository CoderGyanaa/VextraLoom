import mongoose, { Schema, Document } from 'mongoose';
const certificationSchema = new Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  category: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  cost: String,
  duration: String,
  skills: [String],
  context: String,
  officialUrl: String,
  status: { type: String, enum: ['active', 'deprecated'], default: 'active' }
}, { timestamps: true });
certificationSchema.index({ skills: 1 });
export const Certification = mongoose.model('Certification', certificationSchema);
