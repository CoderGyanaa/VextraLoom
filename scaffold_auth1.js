const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'server', 'src');

// 1. RefreshToken Model
fs.writeFileSync(path.join(srcDir, 'models', 'RefreshToken.ts'), `
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
`);

// 2. Auth Util
fs.writeFileSync(path.join(srcDir, 'utils', 'auth.ts'), `
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, config.jwtAccessSecret || 'dev_access_secret', {
    expiresIn: config.jwtAccessExpiresIn || '15m'
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.jwtRefreshSecret || 'dev_refresh_secret', {
    expiresIn: config.jwtRefreshExpiresIn || '7d'
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwtAccessSecret || 'dev_access_secret');
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwtRefreshSecret || 'dev_refresh_secret');
};
`);

// 3. Auth Middleware
fs.writeFileSync(path.join(srcDir, 'middleware', 'auth.middleware.ts'), `
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { verifyAccessToken } from '../utils/auth';
import { AppError } from '../utils/AppError';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded: any = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) {
      return next(new AppError('User not found', 401, 'UNAUTHORIZED'));
    }
    
    if (user.status === 'suspended') {
      return next(new AppError('Account is suspended', 403, 'FORBIDDEN'));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Not authorized, token failed', 401, 'UNAUTHORIZED'));
  }
});

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(\`User role \${req.user?.role} is not authorized to access this route\`, 403, 'FORBIDDEN'));
    }
    next();
  };
};
`);

// 4. Rate Limiter Middleware
fs.writeFileSync(path.join(srcDir, 'middleware', 'rateLimiter.ts'), `
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    error: { code: 'TOO_MANY_REQUESTS' }
  },
  standardHeaders: true,
  legacyHeaders: false,
});
`);

// 5. Auth Validators
fs.writeFileSync(path.join(srcDir, 'validators', 'auth.validator.ts'), `
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});
`);

console.log("Scaffolded Auth Boilerplate");
