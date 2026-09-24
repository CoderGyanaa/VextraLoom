import mongoose, { Schema, Document } from 'mongoose';
const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  linkAction: String
}, { timestamps: true });
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
export const Notification = mongoose.model('Notification', notificationSchema);
