import mongoose, { Schema, Document } from 'mongoose';
const resourceSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['article', 'video', 'course', 'book', 'repository'] },
  url: String,
  author: String,
  tags: [String],
  difficulty: String
}, { timestamps: true });
resourceSchema.index({ tags: 1 });
export const Resource = mongoose.model('Resource', resourceSchema);
