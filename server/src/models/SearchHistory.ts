import mongoose, { Schema, Document } from 'mongoose';
const searchHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional, can be tied to session
  query: String,
  category: String,
  filters: Schema.Types.Mixed,
  resultCount: Number
}, { timestamps: true });
searchHistorySchema.index({ user: 1, createdAt: -1 });
export const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
