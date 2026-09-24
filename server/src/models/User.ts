import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document { email: string; passwordHash: string; role: string; status: string; }
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'suspended', 'unverified'], default: 'unverified' }
}, { timestamps: true });
export const User = mongoose.model<IUser>('User', userSchema);
