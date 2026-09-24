import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import apiRoutes from './routes/index';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root info route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'VEXTRALOOM API',
    description: 'Career Operating System for Students',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health'
    }
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Legacy health check alias for easy probing
app.use('/health', apiRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
    error: { code: 'NOT_FOUND' }
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
