const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'server', 'src');

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

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json({ 
    success: true, 
    message: 'If an account exists for this email, a password reset link will be sent.' 
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);
  res.status(200).json({ 
    success: true, 
    message: 'Password reset successful. Please log in with your new password.' 
  });
});

export const googleSignIn = asyncHandler(async (req: Request, res: Response) => {
  const ip = req.ip || 'unknown';
  const { user, accessToken, refreshToken } = await authService.googleSignIn(req.body, ip);
  
  setTokenCookie(res, refreshToken);
  res.status(200).json({ success: true, data: { user, accessToken } });
});
`);

fs.writeFileSync(path.join(srcDir, 'routes', 'auth.routes.ts'), `
import { Router } from 'express';
import { register, login, refresh, logout, getMe, forgotPassword, resetPassword, googleSignIn } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, googleSignInSchema } from '../validators/auth.validator';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Extensions
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.post('/google', authLimiter, validate(googleSignInSchema), googleSignIn);

export default router;
`);
