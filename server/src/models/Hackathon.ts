import mongoose, { Schema, Document } from 'mongoose';
const hackathonSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  themes: [String],
  location: [String],
  mode: { type: String, enum: ['online', 'offline', 'hybrid'] },
  teamSize: String,
  prizePool: String,
  deadline: Date,
  startDate: Date,
  endDate: Date,
  postedAt: Date,
  officialUrl: String,
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' }
}, { timestamps: true });
hackathonSchema.index({ status: 1, startDate: 1 });
export const Hackathon = mongoose.model('Hackathon', hackathonSchema);
