
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document { 
  email: string; 
  passwordHash?: string; 
  role: string; 
  status: string; 
  authProvider: string;
  googleId?: string;
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { 
    type: String, 
    required: function(this: any) { return this.authProvider === 'local' || this.authProvider === 'both'; } 
  },
  role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'suspended', 'unverified'], default: 'active' }, // defaulted to active for this phase
  authProvider: { type: String, enum: ['local', 'google', 'both'], default: 'local' },
  googleId: { type: String, sparse: true, index: true }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
