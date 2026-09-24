import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { config } from '../config/env';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'success',
    message: 'VEXTRALOOM API is running',
    system: 'VEXTRALOOM Career Operating System API',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

export default router;
