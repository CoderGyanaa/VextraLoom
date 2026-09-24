import mongoose, { Schema, Document } from 'mongoose';
const challengeSchema = new Schema({
  title: { type: String, required: true },
  platform: String,
  difficulty: String,
  tags: [String],
  url: String,
  description: String
}, { timestamps: true });
export const Challenge = mongoose.model('Challenge', challengeSchema);
