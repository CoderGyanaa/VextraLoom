import { SearchCriteria, SavedSearchItem, SearchHistoryItem, SearchCategory } from './types';

const SAVED_SEARCHES_KEY = 'vextraloom_saved_linkedin_searches';
const SEARCH_HISTORY_KEY = 'vextraloom_linkedin_search_history';

export const STUDENT_PRESETS: Record<string, Partial<SearchCriteria>> = {
  'B.Tech Fresher': {
    role: 'Software Engineer',
    skills: ['Java', 'SQL', 'Data Structures'],
    experience: 'fresher',
    employmentType: 'full_time',
    datePosted: 'past_week',
    workMode: 'any',
    education: {
      includeInQuery: true,
      degree: 'B.Tech',
      field: 'Computer Science',
      graduationYear: '2026',
      studyStatus: 'Recently Graduated'
    }
  },
  'MCA Fresher': {
    role: 'Java Developer',
    skills: ['Java', 'Spring Boot', 'SQL', 'Git'],
    experience: 'fresher',
    employmentType: 'full_time',
    datePosted: 'past_week',
    workMode: 'any',
    education: {
      includeInQuery: true,
      degree: 'MCA',
      field: 'Computer Science',
      graduationYear: '2026',
      studyStatus: 'Recently Graduated'
    }
  },
  'Final-Year Student': {
    role: 'Software Developer Trainee',
    skills: ['Python', 'SQL', 'Web Development'],
    experience: 'student',
    employmentType: 'internship',
    datePosted: 'past_week',
    workMode: 'any',
    education: {
      includeInQuery: true,
      degree: 'B.Tech',
      field: 'Computer Science',
      graduationYear: '2026',
      studyStatus: 'Final Year'
    }
  },
  '2026 Graduate': {
    role: 'Graduate Engineer Trainee',
    skills: ['Java', 'Problem Solving', 'OOPs'],
    experience: 'entry_level',
    employmentType: 'full_time',
    datePosted: 'past_month',
    workMode: 'any',
    education: {
      includeInQuery: true,
      degree: 'B.Tech / B.E.',
      field: 'Information Technology',
      graduationYear: '2026',
      studyStatus: 'Final Year'
    }
  },
  'Internship for Students': {
    role: 'Software Development Intern',
    skills: ['JavaScript', 'React', 'HTML/CSS'],
    experience: 'student',
    employmentType: 'internship',
    datePosted: 'past_24h',
    workMode: 'remote',
    education: {
      includeInQuery: false,
      studyStatus: 'Current Student'
    }
  },
  'Entry-Level Jobs': {
    role: 'Junior Software Engineer',
    skills: ['Java', 'C++', 'Backend'],
    experience: 'entry_level',
    employmentType: 'full_time',
    datePosted: 'past_24h',
    workMode: 'hybrid',
    education: {
      includeInQuery: false
    }
  }
};

export const BRANCH_SUGGESTIONS: Record<string, string[]> = {
  'Computer Science': [
    'Software Engineer', 'Java Developer', 'Backend Developer', 
    'Full Stack Developer', 'Data Analyst', 'Cloud Engineer', 'AI/ML Engineer'
  ],
  'Information Technology': [
    'Software Engineer', 'Web Developer', 'Cloud Trainee', 
    'DevOps Engineer', 'System Analyst', 'Database Administrator'
  ],
  'Data Science': [
    'Data Analyst', 'Junior Data Scientist', 'Machine Learning Intern', 
    'Business Intelligence Analyst', 'Python Developer'
  ],
  'Artificial Intelligence': [
    'AI Engineer', 'ML Research Trainee', 'Computer Vision Intern', 
    'NLP Trainee', 'Data Engineer'
  ],
  'Electronics & Communication': [
    'Embedded Systems Engineer', 'IoT Developer', 'VLSI Trainee', 
    'Firmware Engineer', 'Hardware Design Intern', 'Software Developer'
  ],
  'Mechanical Engineering': [
    'Design Engineer Trainee', 'CAD/CAM Engineer', 'Automation Trainee', 
    'Robotics Intern', 'Quality Assurance Trainee'
  ],
  'Civil Engineering': [
    'Site Engineer', 'Structural Design Trainee', 'BIM Modeler', 
    'GIS Analyst', 'Project Coordinator'
  ],
  'Business / Management': [
    'Management Trainee', 'Business Analyst', 'Associate Product Manager', 
    'Operations Analyst', 'Marketing Associate'
  ]
};

export const SearchStorage = {
  getSavedSearches(): SavedSearchItem[] {
    try {
      const data = localStorage.getItem(SAVED_SEARCHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSearch(name: string, criteria: SearchCriteria, category: SearchCategory): SavedSearchItem {
    const items = this.getSavedSearches();
    const newItem: SavedSearchItem = {
      id: 'saved_' + Date.now().toString(),
      name,
      criteria,
      category,
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...items].slice(0, 30);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
    return newItem;
  },

  deleteSavedSearch(id: string): void {
    const items = this.getSavedSearches().filter(item => item.id !== id);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(items));
  },

  getHistory(): SearchHistoryItem[] {
    try {
      const data = localStorage.getItem(SEARCH_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addHistory(criteria: SearchCriteria, category: SearchCategory, generatedQuery: string): void {
    const items = this.getHistory();
    const newItem: SearchHistoryItem = {
      id: 'hist_' + Date.now().toString(),
      criteria,
      category,
      generatedQuery,
      timestamp: new Date().toISOString()
    };
    const updated = [newItem, ...items].slice(0, 20);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  },

  clearHistory(): void {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }
};
