import mongoose, { Schema, Document } from 'mongoose';
export interface IJob extends Document { title: string; organization: string; description: string; skills: string[]; location: string[]; workMode: string; eligibility: string; deadline: Date; postedAt: Date; source: string; officialName: string; officialUrl: string; lastVerifiedAt: Date; status: string; }
const jobSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  location: [String],
  workMode: { type: String, enum: ['remote', 'hybrid', 'onsite'] },
  eligibility: String,
  deadline: Date,
  postedAt: Date,
  source: String,
  officialName: String,
  officialUrl: String,
  lastVerifiedAt: Date,
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' }
}, { timestamps: true });
jobSchema.index({ status: 1, postedAt: -1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ workMode: 1 });
export const Job = mongoose.model<IJob>('Job', jobSchema);
