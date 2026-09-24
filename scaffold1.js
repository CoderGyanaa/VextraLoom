const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'server', 'src');
const dirs = ['models', 'controllers', 'services', 'middleware', 'validators', 'utils', 'routes', '__tests__'];

dirs.forEach(d => {
  const dirPath = path.join(srcDir, d);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// AppError
fs.writeFileSync(path.join(srcDir, 'utils', 'AppError.ts'), `
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code: string = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
`);

// Error Middleware
fs.writeFileSync(path.join(srcDir, 'middleware', 'error.middleware.ts'), `
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
    message = \`Invalid \${err.path}: \${err.value}\`;
    code = 'INVALID_ID';
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    code = 'DUPLICATE_ERROR';
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = err.errors.map((e: any) => \`\${e.path.join('.')}: \${e.message}\`).join(', ');
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
`);

// Validate Middleware
fs.writeFileSync(path.join(srcDir, 'middleware', 'validate.middleware.ts'), `
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR'));
    }
  };
`);

// Models... we need 17 files. I will generate them programmatically to save time.
const models = {
  User: `
import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document { email: string; passwordHash: string; role: string; status: string; }
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'suspended', 'unverified'], default: 'unverified' }
}, { timestamps: true });
export const User = mongoose.model<IUser>('User', userSchema);
  `,
  Profile: `
import mongoose, { Schema, Document } from 'mongoose';
export interface IProfile extends Document { user: mongoose.Types.ObjectId; basic: any; education: any; career: any; technical: any; scholarshipInfo: any; }
const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  basic: { name: { type: String, required: true }, phone: String, profilePhoto: String },
  education: { level: String, degree: String, branch: String, college: String, graduationYear: Number, currentYear: String, state: String, district: String },
  career: { targetRoles: [String], skills: [String], preferredLocations: [String], preferredCompanies: [String], workMode: [String], experienceLevel: String, expectedSalary: String },
  technical: { programmingLanguages: [String], frameworks: [String], databases: [String], cloud: [String], tools: [String], certifications: [String] },
  scholarshipInfo: { state: String, category: String, gender: String, familyIncome: String, disabilityStatus: Boolean, hostellerStatus: Boolean, educationLevel: String, branch: String }
}, { timestamps: true });
profileSchema.index({ 'career.targetRoles': 1 });
profileSchema.index({ 'career.skills': 1 });
profileSchema.index({ 'education.college': 1 });
export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
  `,
  Job: `
import mongoose, { Schema, Document } from 'mongoose';
export interface IJob extends Document { title: string; organization: string; description: string; skills: string[]; location: string[]; workMode: string; eligibility: string; deadline: Date; postedAt: Date; source: string; officialName: string; officialUrl: string; lastVerifiedAt: Date; status: string; }
const jobSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  location: [String],
  workMode: { type: String, enum: ['remote', 'hybrid', 'onsite'] },
  eligibility: String,
  deadline: Date,
  postedAt: Date,
  source: String,
  officialName: String,
  officialUrl: String,
  lastVerifiedAt: Date,
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' }
}, { timestamps: true });
jobSchema.index({ status: 1, postedAt: -1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ workMode: 1 });
export const Job = mongoose.model<IJob>('Job', jobSchema);
  `,
  Internship: `
import mongoose, { Schema, Document } from 'mongoose';
export interface IInternship extends Document { title: string; organization: string; duration: string; stipend: string; } // Reduced props for brevity in generator, but matching others ideally
const internshipSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  location: [String],
  workMode: { type: String, enum: ['remote', 'hybrid', 'onsite'] },
  duration: String,
  stipend: String,
  eligibility: String,
  deadline: Date,
  postedAt: Date,
  source: String,
  officialUrl: String,
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' }
}, { timestamps: true });
internshipSchema.index({ status: 1, postedAt: -1 });
internshipSchema.index({ skills: 1 });
export const Internship = mongoose.model<IInternship>('Internship', internshipSchema);
  `,
  Hackathon: `
import mongoose, { Schema, Document } from 'mongoose';
const hackathonSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  themes: [String],
  location: [String],
  mode: { type: String, enum: ['online', 'offline', 'hybrid'] },
  teamSize: String,
  prizePool: String,
  deadline: Date,
  startDate: Date,
  endDate: Date,
  postedAt: Date,
  officialUrl: String,
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' }
}, { timestamps: true });
hackathonSchema.index({ status: 1, startDate: 1 });
export const Hackathon = mongoose.model('Hackathon', hackathonSchema);
  `,
  Scholarship: `
import mongoose, { Schema, Document } from 'mongoose';
const scholarshipSchema = new Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  amount: String,
  eligibility: { state: [String], category: [String], gender: [String], maxFamilyIncome: Number, educationLevel: [String], branch: [String] },
  deadline: Date,
  postedAt: Date,
  officialUrl: String,
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' }
}, { timestamps: true });
scholarshipSchema.index({ status: 1, deadline: 1 });
export const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
  `,
  Certification: `
import mongoose, { Schema, Document } from 'mongoose';
const certificationSchema = new Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  category: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  cost: String,
  duration: String,
  skills: [String],
  context: String,
  officialUrl: String,
  status: { type: String, enum: ['active', 'deprecated'], default: 'active' }
}, { timestamps: true });
certificationSchema.index({ skills: 1 });
export const Certification = mongoose.model('Certification', certificationSchema);
  `,
  Roadmap: `
import mongoose, { Schema, Document } from 'mongoose';
const roadmapSchema = new Schema({
  title: { type: String, required: true },
  category: String,
  difficulty: String,
  estimatedDuration: String,
  targetRole: String,
  foundationSkills: [String],
  coreSkills: [String],
  tools: [String],
  certifications: [{ type: Schema.Types.ObjectId, ref: 'Certification' }],
  projects: [{ title: String, description: String, skills: [String] }],
  learningResources: [{ title: String, url: String, type: { type: String } }],
  interviewPreparation: [String],
  placementPreparation: [String],
  careerOutcomes: [String],
  monthByMonthPath: [{ month: Number, title: String, focus: [String] }],
  communities: [{ name: String, url: String }]
}, { timestamps: true });
roadmapSchema.index({ targetRole: 1 });
export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
  `,
  Resource: `
import mongoose, { Schema, Document } from 'mongoose';
const resourceSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['article', 'video', 'course', 'book', 'repository'] },
  url: String,
  author: String,
  tags: [String],
  difficulty: String
}, { timestamps: true });
resourceSchema.index({ tags: 1 });
export const Resource = mongoose.model('Resource', resourceSchema);
  `,
  Challenge: `
import mongoose, { Schema, Document } from 'mongoose';
const challengeSchema = new Schema({
  title: { type: String, required: true },
  platform: String,
  difficulty: String,
  tags: [String],
  url: String,
  description: String
}, { timestamps: true });
export const Challenge = mongoose.model('Challenge', challengeSchema);
  `,
  OpenSourceOpportunity: `
import mongoose, { Schema, Document } from 'mongoose';
const openSourceSchema = new Schema({
  projectName: { type: String, required: true },
  organization: String,
  repositoryUrl: String,
  techStack: [String],
  difficulty: String,
  labels: [String],
  issueUrl: String,
  postedAt: Date,
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });
openSourceSchema.index({ techStack: 1, status: 1 });
export const OpenSourceOpportunity = mongoose.model('OpenSourceOpportunity', openSourceSchema);
  `,
  Tool: `
import mongoose, { Schema, Document } from 'mongoose';
const toolSchema = new Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
  url: String,
  pricing: String,
  tags: [String]
}, { timestamps: true });
export const Tool = mongoose.model('Tool', toolSchema);
  `,
  SavedItem: `
import mongoose, { Schema, Document } from 'mongoose';
const savedItemSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemModel: { type: String, required: true, enum: ['Job', 'Internship', 'Scholarship', 'Hackathon', 'Roadmap', 'Certification', 'Tool', 'Resource', 'Challenge', 'OpenSourceOpportunity'] },
  itemId: { type: Schema.Types.ObjectId, required: true, refPath: 'itemModel' }
}, { timestamps: true });
savedItemSchema.index({ user: 1, itemId: 1 }, { unique: true });
export const SavedItem = mongoose.model('SavedItem', savedItemSchema);
  `,
  SearchHistory: `
import mongoose, { Schema, Document } from 'mongoose';
const searchHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional, can be tied to session
  query: String,
  category: String,
  filters: Schema.Types.Mixed,
  resultCount: Number
}, { timestamps: true });
searchHistorySchema.index({ user: 1, createdAt: -1 });
export const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
  `,
  AIHistory: `
import mongoose, { Schema, Document } from 'mongoose';
const aiHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tool: { type: String, required: true },
  inputMetadata: Schema.Types.Mixed,
  outputMetadata: Schema.Types.Mixed,
  status: { type: String, enum: ['processing', 'completed', 'failed'] }
}, { timestamps: true });
aiHistorySchema.index({ user: 1, createdAt: -1 });
export const AIHistory = mongoose.model('AIHistory', aiHistorySchema);
  `,
  UserPreference: `
import mongoose, { Schema, Document } from 'mongoose';
const userPreferenceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferredRoles: [String],
  preferredSkills: [String],
  preferredLocations: [String],
  preferredCompanies: [String],
  workMode: [String],
  notificationPreferences: { email: Boolean, push: Boolean, digest: Boolean },
  searchPreferences: Schema.Types.Mixed
}, { timestamps: true });
export const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);
  `,
  Notification: `
import mongoose, { Schema, Document } from 'mongoose';
const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  linkAction: String
}, { timestamps: true });
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
export const Notification = mongoose.model('Notification', notificationSchema);
  `
};

Object.keys(models).forEach(name => {
  fs.writeFileSync(path.join(srcDir, 'models', name + '.ts'), models[name].trim() + '\\n');
});

console.log("Generated models and middlewares.");
