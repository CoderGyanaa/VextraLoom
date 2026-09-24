
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, config.jwtAccessSecret || 'dev_access_secret', {
    expiresIn: (config.jwtAccessExpiresIn || '15m') as any
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.jwtRefreshSecret || 'dev_refresh_secret', {
    expiresIn: (config.jwtRefreshExpiresIn || '7d') as any
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwtAccessSecret || 'dev_access_secret');
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwtRefreshSecret || 'dev_refresh_secret');
};
