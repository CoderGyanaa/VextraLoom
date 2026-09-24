
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
