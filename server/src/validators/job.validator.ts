
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
