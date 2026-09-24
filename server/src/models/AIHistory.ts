import mongoose, { Schema, Document } from 'mongoose';
const aiHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tool: { type: String, required: true },
  inputMetadata: Schema.Types.Mixed,
  outputMetadata: Schema.Types.Mixed,
  status: { type: String, enum: ['processing', 'completed', 'failed'] }
}, { timestamps: true });
aiHistorySchema.index({ user: 1, createdAt: -1 });
export const AIHistory = mongoose.model('AIHistory', aiHistorySchema);
