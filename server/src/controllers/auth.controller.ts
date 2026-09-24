
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
