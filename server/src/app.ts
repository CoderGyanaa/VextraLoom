import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import healthRoutes from './routes/health.routes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Health check endpoints
app.use('/health', healthRoutes);
app.use('/api/v1/health', healthRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error occurred',
    details: config.nodeEnv === 'development' ? err.message : undefined
  });
});

export default app;
