const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'server', 'src');

// Auth Service
fs.writeFileSync(path.join(srcDir, 'services', 'auth.service.ts'), `
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { RefreshToken } from '../models/RefreshToken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth';
import { AppError } from '../utils/AppError';

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
      status: 'active' // auto-active for now
    });

    await Profile.create({
      user: user._id,
      basic: { name }
    });

    const accessToken = generateAccessToken(user._id as string, user.role);
    const refreshToken = generateRefreshToken(user._id as string);
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
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended') {
      throw new AppError('Account is suspended', 403, 'FORBIDDEN');
    }

    const accessToken = generateAccessToken(user._id as string, user.role);
    const refreshToken = generateRefreshToken(user._id as string);
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
    
    if (!refreshToken || !refreshToken.isActive) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    try {
      const decoded: any = verifyRefreshToken(token);
      const user: any = refreshToken.user;
      
      if (user.status === 'suspended') {
        throw new AppError('Account is suspended', 403, 'FORBIDDEN');
      }

      // Revoke old token
      refreshToken.revoked = new Date();
      refreshToken.revokedByIp = ip;
      
      const newAccessToken = generateAccessToken(user._id, user.role);
      const newRefreshTokenStr = generateRefreshToken(user._id);
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
      // Token is invalid/expired cryptographically
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
  }
};
`);

// Auth Controller
fs.writeFileSync(path.join(srcDir, 'controllers', 'auth.controller.ts'), `
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { authService } from '../services/auth.service';
import { config } from '../config/env';

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const ip = req.ip || 'unknown';
  const { user, accessToken, refreshToken } = await authService.register(req.body, ip);
  
  setTokenCookie(res, refreshToken);
  res.status(201).json({ success: true, data: { user, accessToken } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const ip = req.ip || 'unknown';
  const { user, accessToken, refreshToken } = await authService.login(req.body, ip);
  
  setTokenCookie(res, refreshToken);
  res.status(200).json({ success: true, data: { user, accessToken } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('No refresh token found');
  }

  const ip = req.ip || 'unknown';
  const { accessToken, refreshToken } = await authService.refresh(token, ip);
  
  setTokenCookie(res, refreshToken);
  res.status(200).json({ success: true, data: { accessToken } });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const ip = req.ip || 'unknown';
    await authService.logout(token, ip);
  }
  
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    expires: new Date(0)
  });
  
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json({ success: true, data: user });
});
`);

// Auth Routes
fs.writeFileSync(path.join(srcDir, 'routes', 'auth.routes.ts'), `
import { Router } from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
`);

console.log("Scaffolded Auth Services and Controllers");
