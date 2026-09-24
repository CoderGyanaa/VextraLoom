import mongoose, { Schema, Document } from 'mongoose';
const savedItemSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemModel: { type: String, required: true, enum: ['Job', 'Internship', 'Scholarship', 'Hackathon', 'Roadmap', 'Certification', 'Tool', 'Resource', 'Challenge', 'OpenSourceOpportunity'] },
  itemId: { type: Schema.Types.ObjectId, required: true, refPath: 'itemModel' }
}, { timestamps: true });
savedItemSchema.index({ user: 1, itemModel: 1, itemId: 1 }, { unique: true });
export const SavedItem = mongoose.model('SavedItem', savedItemSchema);
