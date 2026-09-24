export type ExperienceLevel = 'student' | 'fresher' | 'entry_level' | 'associate' | 'mid_level' | 'any';

export type WorkMode = 'remote' | 'hybrid' | 'onsite' | 'any';

export type EmploymentType = 'full_time' | 'internship' | 'part_time' | 'contract' | 'any';

export type DatePosted = 'past_24h' | 'past_week' | 'past_month' | 'any';

export type SearchCategory = 'jobs' | 'posts' | 'people' | 'companies' | 'events' | 'courses' | 'all';

export interface EducationCriteria {
  includeInQuery?: boolean;
  level?: string;
  degree?: string;
  field?: string;
  college?: string;
  graduationYear?: string;
  studyStatus?: string;
}

export interface SearchCriteria {
  role: string;
  roles?: string[];
  skills: string[];
  keywords?: string;
  experience: ExperienceLevel;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  datePosted: DatePosted;
  company?: string;
  industry?: string;
  easyApplyOnly?: boolean;
  under10Applicants?: boolean;
  inMyNetwork?: boolean;
  education?: EducationCriteria;
}

export interface OptimizedSearchResult {
  category: SearchCategory;
  label: string;
  description: string;
  url: string;
  queryUsed: string;
  appliedFiltersSummary: string[];
}

export interface SavedSearchItem {
  id: string;
  name: string;
  criteria: SearchCriteria;
  category: SearchCategory;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  criteria: SearchCriteria;
  category: SearchCategory;
  generatedQuery: string;
  timestamp: string;
}
