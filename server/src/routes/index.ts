
import { Router } from 'express';
import healthRoutes from './health.routes';
import jobRoutes from './job.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/jobs', jobRoutes);
// Placeholder for other routes
// router.use('/users', userRoutes);
// router.use('/profiles', profileRoutes);

export default router;
