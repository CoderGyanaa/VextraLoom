
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
