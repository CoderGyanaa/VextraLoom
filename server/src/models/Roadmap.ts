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
