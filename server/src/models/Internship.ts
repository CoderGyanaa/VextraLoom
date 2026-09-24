import mongoose, { Schema, Document } from 'mongoose';
export interface IInternship extends Document { title: string; organization: string; duration: string; stipend: string; } // Reduced props for brevity in generator, but matching others ideally
const internshipSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  location: [String],
  workMode: { type: String, enum: ['remote', 'hybrid', 'onsite'] },
  duration: String,
  stipend: String,
  eligibility: String,
  deadline: Date,
  postedAt: Date,
  source: String,
  officialUrl: String,
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' }
}, { timestamps: true });
internshipSchema.index({ status: 1, postedAt: -1 });
internshipSchema.index({ skills: 1 });
export const Internship = mongoose.model<IInternship>('Internship', internshipSchema);
