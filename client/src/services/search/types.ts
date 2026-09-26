export type ExperienceLevel = 'student' | 'fresher' | 'entry_level' | 'associate' | 'mid_level' | 'any';

export type WorkMode = 'remote' | 'hybrid' | 'onsite' | 'any';

export type EmploymentType = 'full_time' | 'internship' | 'part_time' | 'contract' | 'any';

export type DatePosted = 'past_24h' | 'past_week' | 'past_month' | 'any';

export type SearchCategory = 'jobs' | 'posts' | 'people' | 'companies' | 'events' | 'courses' | 'all';

export type SearchMode = 'smart' | 'boolean';

export interface QueryHealthItem {
  id: string;
  type: 'warning' | 'info';
  message: string;
  suggestion?: string;
}

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
  coreSkills?: string[];
  supportingSkills?: string[];
  keywords?: string;
  experience: ExperienceLevel;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  datePosted: DatePosted;
  company?: string;
  targetCompanies?: string[];
  salaryMin?: string;
  salaryMax?: string;
  industry?: string;
  easyApplyOnly?: boolean;
  under10Applicants?: boolean;
  inMyNetwork?: boolean;
  education?: EducationCriteria;
  searchMode?: SearchMode;
  useSynonyms?: boolean;
  synonyms?: string[];
  excludeSeniorRoles?: boolean;
  customExclusions?: string[];
}

export interface OptimizedSearchResult {
  category: SearchCategory;
  label: string;
  actionText?: string;
  description: string;
  url: string;
  queryUsed: string;
  appliedFiltersSummary: string[];
  explanation?: string;
}

export interface SearchPack {
  jobs: OptimizedSearchResult;
  posts: OptimizedSearchResult;
  people: OptimizedSearchResult;
  companies: OptimizedSearchResult;
  events: OptimizedSearchResult;
  courses: OptimizedSearchResult;
  explanation: string;
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
