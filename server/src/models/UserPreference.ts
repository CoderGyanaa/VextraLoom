import mongoose, { Schema, Document } from 'mongoose';
const userPreferenceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferredRoles: [String],
  preferredSkills: [String],
  preferredLocations: [String],
  preferredCompanies: [String],
  workMode: [String],
  notificationPreferences: { email: Boolean, push: Boolean, digest: Boolean },
  searchPreferences: Schema.Types.Mixed
}, { timestamps: true });
export const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);
