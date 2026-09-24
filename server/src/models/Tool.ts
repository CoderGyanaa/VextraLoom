import mongoose, { Schema, Document } from 'mongoose';
const toolSchema = new Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
  url: String,
  pricing: String,
  tags: [String]
}, { timestamps: true });
export const Tool = mongoose.model('Tool', toolSchema);
