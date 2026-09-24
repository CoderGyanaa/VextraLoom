
import { Router } from 'express';
import { getJobs, createJob } from '../controllers/job.controller';
import { validate } from '../middleware/validate.middleware';
import { createJobSchema } from '../validators/job.validator';

const router = Router();

router.get('/', getJobs);
router.post('/', validate(createJobSchema), createJob);

export default router;
