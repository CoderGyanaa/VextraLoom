
import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  expires: Date;
  createdByIp: string;
  revoked?: Date;
  revokedByIp?: string;
  replacedByToken?: string;
  isExpired: boolean;
  isActive: boolean;
}

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
  createdByIp: { type: String, required: true },
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String
}, { timestamps: true });

refreshTokenSchema.virtual('isExpired').get(function(this: any) {
  return Date.now() >= this.expires;
});
refreshTokenSchema.virtual('isActive').get(function(this: any) {
  return !this.revoked && !this.isExpired;
});

refreshTokenSchema.index({ user: 1 });
refreshTokenSchema.index({ token: 1 });

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
