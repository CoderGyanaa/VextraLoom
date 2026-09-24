
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    code = 'INVALID_ID';
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    code = 'DUPLICATE_ERROR';
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    code = 'VALIDATION_ERROR';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
