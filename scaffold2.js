const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'server', 'src');

fs.writeFileSync(path.join(srcDir, 'validators', 'job.validator.ts'), `
import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    organization: z.string().min(2),
    description: z.string().min(10),
    skills: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    workMode: z.enum(['remote', 'hybrid', 'onsite']).optional(),
    status: z.enum(['active', 'expired', 'draft']).optional()
  })
});
`);

fs.writeFileSync(path.join(srcDir, 'services', 'job.service.ts'), `
import { Job } from '../models/Job';
import { AppError } from '../utils/AppError';

export const jobService = {
  async getAllJobs(filters: any) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    return await Job.find(query).sort({ postedAt: -1 }).limit(20);
  },
  
  async createJob(jobData: any) {
    const job = new Job({ ...jobData, postedAt: new Date() });
    await job.save();
    return job;
  }
};
`);

fs.writeFileSync(path.join(srcDir, 'controllers', 'job.controller.ts'), `
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { jobService } from '../services/job.service';

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const jobs = await jobService.getAllJobs(req.query);
  res.status(200).json({ success: true, data: jobs });
});

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await jobService.createJob(req.body);
  res.status(201).json({ success: true, data: job });
});
`);

fs.writeFileSync(path.join(srcDir, 'routes', 'job.routes.ts'), `
import { Router } from 'express';
import { getJobs, createJob } from '../controllers/job.controller';
import { validate } from '../middleware/validate.middleware';
import { createJobSchema } from '../validators/job.validator';

const router = Router();

router.get('/', getJobs);
router.post('/', validate(createJobSchema), createJob);

export default router;
`);

fs.writeFileSync(path.join(srcDir, 'routes', 'index.ts'), `
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
`);

console.log("Generated API Architecture (Routes, Controllers, Services).");
