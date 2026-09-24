const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'server', 'src');

fs.writeFileSync(path.join(srcDir, 'services', 'auth.service.ts'), `
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { RefreshToken } from '../models/RefreshToken';
import { PasswordResetToken } from '../models/PasswordResetToken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth';
import { AppError } from '../utils/AppError';
import { emailService } from './email.service';
import { config } from '../config/env';

const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id');

export const authService = {
  async register(data: any, ip: string) {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email is already registered', 400, 'DUPLICATE_EMAIL');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash,
      role: 'student',
      status: 'active',
      authProvider: 'local'
    });

    await Profile.create({
      user: user._id,
      basic: { name }
    });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    const decodedRefresh: any = verifyRefreshToken(refreshToken);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expires: new Date(decodedRefresh.exp * 1000),
      createdByIp: ip
    });

    const safeUser = { id: user._id, email: user.email, role: user.role, status: user.status, name };
    return { user: safeUser, accessToken, refreshToken };
  },

  async login(data: any, ip: string) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended') {
      throw new AppError('Account is suspended', 403, 'FORBIDDEN');
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    const decodedRefresh: any = verifyRefreshToken(refreshToken);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expires: new Date(decodedRefresh.exp * 1000),
      createdByIp: ip
    });

    const profile = await Profile.findOne({ user: user._id });
    const safeUser = { id: user._id, email: user.email, role: user.role, status: user.status, name: profile?.basic?.name };
    
    return { user: safeUser, accessToken, refreshToken };
  },

  async refresh(token: string, ip: string) {
    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    
    if (!refreshToken) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    if (!refreshToken.isActive) {
      // SECURITY: REUSE DETECTED! A previously used/revoked token was presented.
      await RefreshToken.updateMany({ user: refreshToken.user._id, revoked: { $exists: false } }, { $set: { revoked: new Date(), revokedByIp: 'REUSE_DETECTION_SYSTEM' } });
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    try {
      const decoded: any = verifyRefreshToken(token);
      const user: any = refreshToken.user;
      
      if (user.status === 'suspended') {
        throw new AppError('Account is suspended', 403, 'FORBIDDEN');
      }

      refreshToken.revoked = new Date();
      refreshToken.revokedByIp = ip;
      
      const newAccessToken = generateAccessToken(user._id.toString(), user.role);
      const newRefreshTokenStr = generateRefreshToken(user._id.toString());
      const decodedNewRefresh: any = verifyRefreshToken(newRefreshTokenStr);
      
      refreshToken.replacedByToken = newRefreshTokenStr;
      await refreshToken.save();

      await RefreshToken.create({
        user: user._id,
        token: newRefreshTokenStr,
        expires: new Date(decodedNewRefresh.exp * 1000),
        createdByIp: ip
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshTokenStr };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
    }
  },

  async logout(token: string, ip: string) {
    const refreshToken = await RefreshToken.findOne({ token });
    if (refreshToken) {
      refreshToken.revoked = new Date();
      refreshToken.revokedByIp = ip;
      await refreshToken.save();
    }
    return true;
  },

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) return true; 

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await PasswordResetToken.create({
      user: user._id,
      tokenHash,
      expiresAt
    });

    await emailService.sendPasswordResetEmail(user.email, resetToken);
    return true;
  },

  async resetPassword(data: any) {
    const { token, password } = data;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() }
    }).populate('user');

    if (!resetRecord) {
      throw new AppError('Invalid or expired password reset token', 400, 'INVALID_RESET_TOKEN');
    }

    const user: any = resetRecord.user;
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    
    // If they were Google only, upgrade to "both" or keep as local
    if (user.authProvider === 'google') user.authProvider = 'both';
    await user.save();

    // Invalidate the reset token
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    // Invalidate all existing sessions
    await RefreshToken.updateMany(
      { user: user._id, revoked: { $exists: false } },
      { $set: { revoked: new Date(), revokedByIp: 'PASSWORD_RESET' } }
    );

    return true;
  },

  async googleSignIn(data: any, ip: string) {
    const { credential } = data;
    
    let payload;
    try {
      // In a real environment, Google verifies the token.
      // For unit tests, we mock this via environment variable or jest spy.
      if (config.nodeEnv === 'test') {
        payload = JSON.parse(Buffer.from(credential, 'base64').toString('ascii'));
      } else {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.VITE_GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
      }
    } catch (err) {
      throw new AppError('Invalid Google credential', 401, 'INVALID_GOOGLE_TOKEN');
    }

    if (!payload || !payload.email) {
      throw new AppError('Invalid Google credential', 401, 'INVALID_GOOGLE_TOKEN');
    }

    const { email, sub: googleId, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (user.authProvider === 'local' && !user.googleId) {
        throw new AppError('An account with this email already exists. Please log in with your password.', 409, 'ACCOUNT_CONFLICT');
      }
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'both';
        await user.save();
      }
    } else {
      user = await User.create({
        email,
        authProvider: 'google',
        googleId,
        role: 'student',
        status: 'active'
      });
      await Profile.create({
        user: user._id,
        basic: { name, profilePhoto: picture }
      });
    }

    if (user.status === 'suspended') {
      throw new AppError('Account is suspended', 403, 'FORBIDDEN');
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    const decodedRefresh: any = verifyRefreshToken(refreshToken);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expires: new Date(decodedRefresh.exp * 1000),
      createdByIp: ip
    });

    const profile = await Profile.findOne({ user: user._id });
    const safeUser = { id: user._id, email: user.email, role: user.role, status: user.status, name: profile?.basic?.name, profilePhoto: profile?.basic?.profilePhoto };
    
    return { user: safeUser, accessToken, refreshToken };
  }
};
`);

// Validator Extension
fs.writeFileSync(path.join(srcDir, 'validators', 'auth.validator.ts'), `
import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/;

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })
});

export const googleSignInSchema = z.object({
  body: z.object({
    credential: z.string().min(1, 'Google credential is required')
  })
});
`);
