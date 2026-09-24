const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'server', 'src');

// 1. Update User Model
fs.writeFileSync(path.join(srcDir, 'models', 'User.ts'), `
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
`);

// 2. PasswordResetToken Model
fs.writeFileSync(path.join(srcDir, 'models', 'PasswordResetToken.ts'), `
import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetToken extends Document {
  user: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
}

const passwordResetTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date }
}, { timestamps: true });

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const PasswordResetToken = mongoose.model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema);
`);

// 3. Email Service Mock
fs.writeFileSync(path.join(srcDir, 'services', 'email.service.ts'), `
import { config } from '../config/env';

export const emailService = {
  async sendPasswordResetEmail(toEmail: string, resetToken: string) {
    const clientOrigin = config.corsOrigin; // Or a dedicated CLIENT_ORIGIN var
    const resetUrl = \`\${clientOrigin}/reset-password?token=\${resetToken}\`;
    
    // In production, integrate SendGrid/AWS SES/Resend here.
    // For now, securely log that an email *would* be sent, without exposing the raw token in standard logs if possible,
    // though for development we will log it to allow manual testing.
    
    if (config.nodeEnv !== 'test') {
      console.log('=============================================');
      console.log(\`MOCK EMAIL SENT TO: \${toEmail}\`);
      console.log(\`SUBJECT: Password Reset Request\`);
      console.log(\`RESET URL: \${resetUrl}\`);
      console.log('=============================================');
    }
    
    return true;
  }
};
`);

console.log("Scaffolded Models and Email Service");
