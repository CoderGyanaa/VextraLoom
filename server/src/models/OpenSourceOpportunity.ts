import mongoose, { Schema, Document } from 'mongoose';
const openSourceSchema = new Schema({
  projectName: { type: String, required: true },
  organization: String,
  repositoryUrl: String,
  techStack: [String],
  difficulty: String,
  labels: [String],
  issueUrl: String,
  postedAt: Date,
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });
openSourceSchema.index({ techStack: 1, status: 1 });
export const OpenSourceOpportunity = mongoose.model('OpenSourceOpportunity', openSourceSchema);
