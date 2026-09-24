import mongoose, { Schema, Document } from 'mongoose';
export interface IProfile extends Document { user: mongoose.Types.ObjectId; basic: any; education: any; career: any; technical: any; scholarshipInfo: any; }
const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  basic: { name: { type: String, required: true }, phone: String, profilePhoto: String },
  education: { level: String, degree: String, branch: String, college: String, graduationYear: Number, currentYear: String, state: String, district: String },
  career: { targetRoles: [String], skills: [String], preferredLocations: [String], preferredCompanies: [String], workMode: [String], experienceLevel: String, expectedSalary: String },
  technical: { programmingLanguages: [String], frameworks: [String], databases: [String], cloud: [String], tools: [String], certifications: [String] },
  scholarshipInfo: { state: String, category: String, gender: String, familyIncome: String, disabilityStatus: Boolean, hostellerStatus: Boolean, educationLevel: String, branch: String }
}, { timestamps: true });
profileSchema.index({ 'career.targetRoles': 1 });
profileSchema.index({ 'career.skills': 1 });
profileSchema.index({ 'education.college': 1 });
export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
