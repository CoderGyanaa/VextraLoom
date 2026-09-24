import mongoose, { Schema, Document } from 'mongoose';
const scholarshipSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  amount: String,
  eligibility: { state: [String], category: [String], gender: [String], maxFamilyIncome: Number, educationLevel: [String], branch: [String] },
  deadline: Date,
  postedAt: Date,
  officialUrl: String,
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' }
}, { timestamps: true });
scholarshipSchema.index({ status: 1, deadline: 1 });
export const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
