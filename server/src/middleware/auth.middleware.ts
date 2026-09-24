
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
      return next(new AppError(`User role ${req.user?.role} is not authorized to access this route`, 403, 'FORBIDDEN'));
    }
    next();
  };
};
