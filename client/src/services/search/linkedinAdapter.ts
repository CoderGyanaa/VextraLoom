import { SearchCriteria, OptimizedSearchResult, SearchPack } from './types';

// Controlled Role Synonyms Dictionary
export const ROLE_SYNONYMS: Record<string, string[]> = {
  'java developer': ['Java Developer', 'Java Backend Developer', 'Backend Developer', 'Java Software Engineer'],
  'backend developer': ['Backend Developer', 'Backend Engineer', 'Software Engineer', 'Server-side Developer'],
  'frontend developer': ['Frontend Developer', 'Frontend Engineer', 'React Developer', 'UI Engineer'],
  'full stack developer': ['Full Stack Developer', 'Full Stack Engineer', 'Software Engineer', 'Web Developer'],
  'software engineer': ['Software Engineer', 'Software Developer', 'SDE', 'Associate Software Engineer'],
  'data analyst': ['Data Analyst', 'Junior Data Analyst', 'Business Intelligence Analyst'],
  'ai/ml engineer': ['Machine Learning Engineer', 'AI Engineer', 'ML Developer', 'Data Scientist'],
  'machine learning': ['Machine Learning Engineer', 'ML Developer', 'Data Scientist'],
  'cloud engineer': ['Cloud Engineer', 'DevOps Engineer', 'Cloud Trainee', 'AWS Developer'],
  'devops engineer': ['DevOps Engineer', 'Cloud Engineer', 'Platform Engineer', 'Site Reliability Engineer'],
  'embedded systems engineer': ['Embedded Systems Engineer', 'Firmware Engineer', 'IoT Engineer', 'Embedded Software Engineer'],
  'embedded systems': ['Embedded Systems Engineer', 'Firmware Engineer', 'IoT Engineer', 'Embedded C Developer'],
  'cybersecurity': ['Cybersecurity Analyst', 'Security Engineer', 'Information Security Specialist'],
  'qa engineer': ['QA Engineer', 'Software Test Engineer', 'Quality Assurance Analyst', 'Automation Tester']
};

// Location Normalization Dictionary
export const LOCATION_SYNONYMS: Record<string, string[]> = {
  'bengaluru': ['Bengaluru', 'Bangalore'],
  'bangalore': ['Bengaluru', 'Bangalore'],
  'mumbai': ['Mumbai', 'Bombay'],
  'bombay': ['Mumbai', 'Bombay'],
  'kolkata': ['Kolkata', 'Calcutta'],
  'calcutta': ['Kolkata', 'Calcutta'],
  'delhi': ['Delhi', 'Gurgaon', 'Gurugram', 'Noida'],
  'delhi ncr': ['Delhi', 'Gurgaon', 'Gurugram', 'Noida'],
  'gurgaon': ['Gurgaon', 'Gurugram'],
  'hyderabad': ['Hyderabad', 'Secunderabad'],
  'chennai': ['Chennai', 'Madras']
};

export const SENIOR_EXCLUSION_TERMS = ['Senior', 'Lead', 'Manager', 'Architect', 'Principal', 'Director', 'Staff'];

export class LinkedInSearchAdapter {
  /**
   * Fetch controlled synonyms for a given target role
   */
  static getRoleSynonyms(role: string): string[] {
    if (!role) return [];
    const normalized = role.toLowerCase().trim();
    for (const [key, synonyms] of Object.entries(ROLE_SYNONYMS)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return synonyms;
      }
    }
    return [role];
  }

  /**
   * Get location normalized variations
   */
  static normalizeLocation(location: string): string[] {
    if (!location) return [];
    const lower = location.toLowerCase().trim();
    for (const [key, variants] of Object.entries(LOCATION_SYNONYMS)) {
      if (lower.includes(key)) {
        return variants;
      }
    }
    return [location.trim()];
  }

  /**
   * Format terms as clean Boolean OR expression with quotes
   */
  static toBooleanOr(terms: string[]): string {
    const cleaned = terms.filter(Boolean).map(t => {
      const trimmed = t.trim();
      return trimmed.includes(' ') && !trimmed.startsWith('"') ? `"${trimmed}"` : trimmed;
    });
    if (cleaned.length === 0) return '';
    if (cleaned.length === 1) return cleaned[0];
    return `(${cleaned.join(' OR ')})`;
  }

  /**
   * 1. Smart Natural Language Query Builder (Default for Jobs)
   */
  static buildSmartJobQuery(criteria: SearchCriteria): string {
    const parts: string[] = [];

    // Experience prefix
    const isFresher = criteria.experience === 'student' || criteria.experience === 'fresher' || criteria.experience === 'entry_level';
    const expPrefix = isFresher ? 'Entry-level' : criteria.experience === 'associate' ? 'Associate' : '';

    // Role with primary synonym if available
    let roleStr = criteria.role?.trim() || 'Software';
    if (criteria.useSynonyms) {
      const syns = criteria.synonyms || this.getRoleSynonyms(criteria.role);
      if (syns.length > 1) {
        roleStr = `${syns[0]} or ${syns[1]}`;
      }
    }

    let mainSentence = expPrefix ? `${expPrefix} ${roleStr} roles` : `${roleStr} roles`;

    // Location
    if (criteria.location) {
      mainSentence += ` in ${criteria.location}`;
    }

    // Education context if enabled
    if (criteria.education?.includeInQuery) {
      const { degree, field, graduationYear } = criteria.education;
      const eduItems: string[] = [];
      if (graduationYear) eduItems.push(`${graduationYear}`);
      if (degree) eduItems.push(degree);
      if (field) eduItems.push(field);
      if (eduItems.length > 0) {
        mainSentence += ` for ${eduItems.join(' ')} graduates`;
      }
    }

    // Core skills (limit 1-3 to avoid keyword stuffing)
    if (criteria.skills && criteria.skills.length > 0) {
      const topSkills = criteria.skills.slice(0, 3);
      if (topSkills.length === 1) {
        mainSentence += ` with ${topSkills[0]} skills`;
      } else if (topSkills.length === 2) {
        mainSentence += ` with ${topSkills[0]} and ${topSkills[1]}`;
      } else {
        mainSentence += ` with ${topSkills[0]}, ${topSkills[1]} and ${topSkills[2]}`;
      }
    }

    parts.push(mainSentence);

    if (criteria.company) {
      parts.push(`at ${criteria.company}`);
    }

    return parts.join(' ').trim();
  }

  /**
   * 2. Precision Boolean Query Builder for Jobs
   * Note: Dedicated filters (Location, Date, Experience, Work Mode) are kept OUT of the query
   */
  static buildBooleanJobQuery(criteria: SearchCriteria): string {
    const conditions: string[] = [];

    // Role Group: target role + synonyms
    const rolesToUse = (criteria.useSynonyms && criteria.synonyms && criteria.synonyms.length > 0)
      ? criteria.synonyms
      : this.getRoleSynonyms(criteria.role || 'Software Engineer');

    const roleBoolean = this.toBooleanOr(rolesToUse);
    if (roleBoolean) conditions.push(roleBoolean);

    // Core Skills Group: 1-3 key skills
    if (criteria.skills && criteria.skills.length > 0) {
      const topSkills = criteria.skills.slice(0, 3);
      const skillsBoolean = this.toBooleanOr(topSkills);
      if (skillsBoolean) conditions.push(skillsBoolean);
    }

    // Company if specified
    if (criteria.company) {
      conditions.push(`"${criteria.company.trim()}"`);
    }

    // Join with AND
    let query = conditions.join(' AND ');

    // Exclusion group if enabled
    if (criteria.excludeSeniorRoles) {
      const exclusions = criteria.customExclusions || SENIOR_EXCLUSION_TERMS;
      const notClause = `NOT (${exclusions.join(' OR ')})`;
      query = query ? `${query} ${notClause}` : notClause;
    }

    return query.trim();
  }

  /**
   * 3. Hiring-Intent Posts Query Builder
   */
  static buildHiringPostQuery(criteria: SearchCriteria): string {
    const conditions: string[] = [];

    // Base hiring terms
    conditions.push('("hiring" OR "we\'re hiring" OR "job opening" OR "off campus" OR "looking for")');

    // Role or primary synonym
    const roleSyns = this.getRoleSynonyms(criteria.role || 'Software Developer').slice(0, 2);
    conditions.push(this.toBooleanOr(roleSyns));

    // Location normalization
    if (criteria.location) {
      const locVariants = this.normalizeLocation(criteria.location);
      conditions.push(this.toBooleanOr(locVariants));
    }

    // Fresher / Student context if applicable
    if (criteria.experience === 'student' || criteria.experience === 'fresher' || criteria.experience === 'entry_level') {
      const gradYear = criteria.education?.graduationYear;
      if (gradYear) {
        conditions.push(`(fresher OR "entry level" OR graduate OR "${gradYear}")`);
      } else {
        conditions.push('(fresher OR "entry level" OR graduate)');
      }
    }

    // Optional 1 core skill
    if (criteria.skills && criteria.skills.length > 0) {
      conditions.push(`"${criteria.skills[0]}"`);
    }

    return conditions.join(' AND ').trim();
  }

  /**
   * 4. Recruiter / People Search Query Builder
   */
  static buildRecruiterQuery(criteria: SearchCriteria): string {
    const conditions: string[] = [];

    // Recruiter & talent acquisition terms
    conditions.push('("technical recruiter" OR "talent acquisition" OR recruiter OR "hiring manager")');

    // Role or technology domain
    const roleTerm = criteria.role || (criteria.skills[0] || 'Tech');
    conditions.push(this.toBooleanOr([roleTerm]));

    // Company (if targeted) or Location
    if (criteria.company) {
      conditions.push(`"${criteria.company}"`);
    }

    if (criteria.location) {
      const locVariants = this.normalizeLocation(criteria.location);
      conditions.push(this.toBooleanOr(locVariants));
    }

    return conditions.join(' AND ').trim();
  }

  /**
   * 5. Companies Search Query
   */
  static buildCompanyQuery(criteria: SearchCriteria): string {
    if (criteria.company) return criteria.company;
    const parts = [criteria.role || 'Technology'];
    if (criteria.industry) parts.push(criteria.industry);
    if (criteria.location) parts.push(criteria.location);
    return parts.join(' ').trim();
  }

  /**
   * 6. Events Search Query
   */
  static buildEventQuery(criteria: SearchCriteria): string {
    const parts = [criteria.role || criteria.skills[0] || 'Software'];
    if (criteria.location) parts.push(criteria.location);
    return parts.join(' ').trim();
  }

  /**
   * 7. Courses Search Query
   */
  static buildCourseQuery(criteria: SearchCriteria): string {
    if (criteria.skills && criteria.skills.length > 0) {
      return criteria.skills.slice(0, 4).join(' ');
    }
    return criteria.role ? `${criteria.role} Development` : 'Software Engineering';
  }

  /**
   * Generate Explanation ("WHY THIS SEARCH")
   */
  static generateExplanation(criteria: SearchCriteria): string {
    const usedFields: string[] = [];
    if (criteria.role) usedFields.push('role');
    if (criteria.skills?.length > 0) usedFields.push(`${criteria.skills.length} core skill(s)`);
    if (criteria.location) usedFields.push('location');
    if (criteria.education?.includeInQuery && criteria.education.degree) usedFields.push('education');

    const offloadedFilters: string[] = [];
    if (criteria.experience !== 'any') offloadedFilters.push(`experience (${criteria.experience})`);
    if (criteria.datePosted !== 'any') offloadedFilters.push(`recency (${criteria.datePosted.replace('_', ' ')})`);
    if (criteria.workMode !== 'any') offloadedFilters.push(`work mode (${criteria.workMode})`);
    if (criteria.employmentType !== 'any') offloadedFilters.push(`type (${criteria.employmentType})`);

    let explanation = `VEXTRALOOM optimized your search intent using: ${usedFields.join(', ')}.`;
    if (offloadedFilters.length > 0) {
      explanation += ` Criteria such as ${offloadedFilters.join(', ')} are offloaded to LinkedIn's native URL filters to maintain high recall.`;
    }
    return explanation;
  }

  /**
   * Build Official LinkedIn Jobs URL & Metadata
   */
  static buildJobSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const isBoolean = criteria.searchMode === 'boolean';
    const query = isBoolean ? this.buildBooleanJobQuery(criteria) : this.buildSmartJobQuery(criteria);

    const params = new URLSearchParams();
    if (query) params.set('keywords', query);
    if (criteria.location) params.set('location', criteria.location);

    const filterSummary: string[] = [];

    // Date filter
    if (criteria.datePosted === 'past_24h') {
      params.set('f_TPR', 'r86400');
      filterSummary.push('Date: Past 24 hours');
    } else if (criteria.datePosted === 'past_week') {
      params.set('f_TPR', 'r604800');
      filterSummary.push('Date: Past week (7 days)');
    } else if (criteria.datePosted === 'past_month') {
      params.set('f_TPR', 'r2592000');
      filterSummary.push('Date: Past month (30 days)');
    }

    // Experience filter
    if (criteria.experience === 'student' || criteria.experience === 'fresher' || criteria.experience === 'entry_level') {
      params.set('f_E', '1,2');
      filterSummary.push('Level: Internship / Entry level');
    } else if (criteria.experience === 'associate') {
      params.set('f_E', '3');
      filterSummary.push('Level: Associate');
    } else if (criteria.experience === 'mid_level') {
      params.set('f_E', '4');
      filterSummary.push('Level: Mid-Senior');
    }

    // Work Mode
    if (criteria.workMode === 'remote') {
      params.set('f_WT', '2');
      filterSummary.push('Work Mode: Remote');
    } else if (criteria.workMode === 'hybrid') {
      params.set('f_WT', '3');
      filterSummary.push('Work Mode: Hybrid');
    } else if (criteria.workMode === 'onsite') {
      params.set('f_WT', '1');
      filterSummary.push('Work Mode: On-site');
    }

    // Employment Type
    if (criteria.employmentType === 'full_time') {
      params.set('f_JT', 'F');
      filterSummary.push('Type: Full-time');
    } else if (criteria.employmentType === 'internship') {
      params.set('f_JT', 'I');
      filterSummary.push('Type: Internship');
    } else if (criteria.employmentType === 'part_time') {
      params.set('f_JT', 'P');
      filterSummary.push('Type: Part-time');
    } else if (criteria.employmentType === 'contract') {
      params.set('f_JT', 'C');
      filterSummary.push('Type: Contract');
    }

    if (criteria.easyApplyOnly) {
      params.set('f_AL', 'true');
      filterSummary.push('Easy Apply');
    }
    if (criteria.under10Applicants) {
      params.set('f_EA', 'true');
      filterSummary.push('<10 Applicants');
    }

    return {
      category: 'jobs',
      label: 'LinkedIn Jobs',
      description: isBoolean 
        ? 'Precision Boolean query targeting exact role synonyms and skill combinations.'
        : 'Natural-language intent optimized for LinkedIn\'s semantic job matching.',
      url: `https://www.linkedin.com/jobs/search/?${params.toString()}`,
      queryUsed: query,
      appliedFiltersSummary: filterSummary,
      explanation: this.generateExplanation(criteria)
    };
  }

  /**
   * Build Official LinkedIn Posts URL & Metadata
   */
  static buildPostSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildHiringPostQuery(criteria);
    const params = new URLSearchParams();
    params.set('keywords', query);
    params.set('sortBy', '"date_posted"');

    return {
      category: 'posts',
      label: 'Hiring Posts',
      description: 'Discover active hiring posts from founders, hiring managers, and team leads sorted by latest.',
      url: `https://www.linkedin.com/search/results/content/?${params.toString()}`,
      queryUsed: query,
      appliedFiltersSummary: ['Sorted by: Latest Posts', 'Hiring Intent Match']
    };
  }

  /**
   * Build Official LinkedIn People/Recruiters URL & Metadata
   */
  static buildPeopleSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildRecruiterQuery(criteria);
    const params = new URLSearchParams();
    params.set('keywords', query);

    return {
      category: 'people',
      label: 'Recruiters & People',
      description: 'Find technical recruiters, talent acquisition partners, and hiring managers in your domain.',
      url: `https://www.linkedin.com/search/results/people/?${params.toString()}`,
      queryUsed: query,
      appliedFiltersSummary: ['Role-specific Recruiters', `Location: ${criteria.location || 'Any'}`]
    };
  }

  /**
   * Build Official LinkedIn Companies URL
   */
  static buildCompanySearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildCompanyQuery(criteria);
    const params = new URLSearchParams();
    params.set('keywords', query);

    return {
      category: 'companies',
      label: 'Companies',
      description: 'Discover organizations and startups actively building in your target field.',
      url: `https://www.linkedin.com/search/results/companies/?${params.toString()}`,
      queryUsed: query,
      appliedFiltersSummary: [`Domain: ${query}`]
    };
  }

  /**
   * Build Official LinkedIn Events URL
   */
  static buildEventSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildEventQuery(criteria);
    const params = new URLSearchParams();
    params.set('keywords', query);

    return {
      category: 'events',
      label: 'Events & Webinars',
      description: 'Find tech meetups, hackathons, and virtual career fairs relevant to your career path.',
      url: `https://www.linkedin.com/search/results/events/?${params.toString()}`,
      queryUsed: query,
      appliedFiltersSummary: [`Topic: ${query}`]
    };
  }

  /**
   * Build Official LinkedIn Courses URL
   */
  static buildCourseSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildCourseQuery(criteria);
    const params = new URLSearchParams();
    params.set('keywords', query);

    return {
      category: 'courses',
      label: 'LinkedIn Learning',
      description: 'Skill up on essential technologies with verified course content.',
      url: `https://www.linkedin.com/learning/search?${params.toString()}`,
      queryUsed: query,
      appliedFiltersSummary: [`Skills: ${query}`]
    };
  }

  /**
   * Build Unified Search Pack
   */
  static buildSearchPack(criteria: SearchCriteria): SearchPack {
    return {
      jobs: this.buildJobSearch(criteria),
      posts: this.buildPostSearch(criteria),
      people: this.buildPeopleSearch(criteria),
      companies: this.buildCompanySearch(criteria),
      events: this.buildEventSearch(criteria),
      courses: this.buildCourseSearch(criteria),
      explanation: this.generateExplanation(criteria)
    };
  }
}
