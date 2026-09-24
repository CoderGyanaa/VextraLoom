import { SearchCriteria, OptimizedSearchResult } from './types';

export class LinkedInSearchAdapter {
  /**
   * Constructs natural language keywords tailored to the category,
   * avoiding keyword stuffing and prioritizing clean intent.
   */
  static buildNaturalQuery(criteria: SearchCriteria, category: string): string {
    const parts: string[] = [];

    const rolePart = criteria.role?.trim();
    const skillsPart = (criteria.skills || []).slice(0, 3).join(' ');
    const locationPart = criteria.location?.trim();

    // Education enrichment if enabled
    let eduPart = '';
    if (criteria.education?.includeInQuery) {
      const { degree, field, graduationYear } = criteria.education;
      const eduTokens: string[] = [];
      if (degree) eduTokens.push(degree);
      if (field) eduTokens.push(field);
      if (graduationYear) eduTokens.push(graduationYear);
      if (eduTokens.length > 0) {
        eduPart = eduTokens.join(' ');
      }
    }

    switch (category) {
      case 'jobs': {
        if (rolePart) parts.push(rolePart);
        if (eduPart) parts.push(eduPart);
        if (skillsPart) parts.push(skillsPart);
        if (criteria.company) parts.push(criteria.company);
        if (criteria.keywords) parts.push(criteria.keywords);
        break;
      }

      case 'posts': {
        // Posts query targets hiring intent directly (e.g., "hiring Java developer Bengaluru 2026")
        parts.push('hiring');
        if (rolePart) parts.push(rolePart);
        if (eduPart) parts.push(eduPart);
        if (skillsPart) parts.push(skillsPart);
        if (locationPart) parts.push(locationPart);
        if (criteria.keywords) parts.push(criteria.keywords);
        break;
      }

      case 'people': {
        // People search targets recruiters / hiring managers
        parts.push('recruiter OR "talent acquisition" OR "hiring manager"');
        if (rolePart) parts.push(rolePart);
        if (criteria.company) parts.push(criteria.company);
        if (locationPart) parts.push(locationPart);
        break;
      }

      case 'companies': {
        if (criteria.company) {
          parts.push(criteria.company);
        } else {
          if (rolePart) parts.push(rolePart);
          if (criteria.industry) parts.push(criteria.industry);
          if (locationPart) parts.push(locationPart);
        }
        break;
      }

      case 'events': {
        if (rolePart) parts.push(rolePart);
        if (skillsPart) parts.push(skillsPart);
        if (locationPart) parts.push(locationPart);
        break;
      }

      case 'courses': {
        if (skillsPart) {
          parts.push(skillsPart);
        } else if (rolePart) {
          parts.push(rolePart);
        }
        break;
      }

      default: {
        if (rolePart) parts.push(rolePart);
        if (skillsPart) parts.push(skillsPart);
      }
    }

    return parts.filter(Boolean).join(' ').trim();
  }

  /**
   * 1. Official LinkedIn Jobs Search
   */
  static buildJobSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildNaturalQuery(criteria, 'jobs');
    const params = new URLSearchParams();

    if (query) params.set('keywords', query);
    if (criteria.location) params.set('location', criteria.location);

    const filterSummary: string[] = [];

    // Date Posted filter (Official LinkedIn f_TPR parameter)
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

    // Experience Level filter (Official LinkedIn f_E parameter)
    // 1 = Internship, 2 = Entry level, 3 = Associate, 4 = Mid-Senior
    if (criteria.experience === 'student' || criteria.experience === 'fresher' || criteria.experience === 'entry_level') {
      params.set('f_E', '1,2');
      filterSummary.push('Experience: Internship / Entry level');
    } else if (criteria.experience === 'associate') {
      params.set('f_E', '3');
      filterSummary.push('Experience: Associate');
    } else if (criteria.experience === 'mid_level') {
      params.set('f_E', '4');
      filterSummary.push('Experience: Mid-Senior level');
    }

    // Work Mode filter (Official LinkedIn f_WT parameter)
    // 1 = On-site, 2 = Remote, 3 = Hybrid
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

    // Employment Type filter (Official LinkedIn f_JT parameter)
    // F = Full-time, P = Part-time, C = Contract, I = Internship, V = Volunteer
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

    // Additional LinkedIn supported filters
    if (criteria.easyApplyOnly) {
      params.set('f_AL', 'true');
      filterSummary.push('Easy Apply Only');
    }
    if (criteria.under10Applicants) {
      params.set('f_EA', 'true');
      filterSummary.push('Under 10 Applicants');
    }

    const url = `https://www.linkedin.com/jobs/search/?${params.toString()}`;

    return {
      category: 'jobs',
      label: 'LinkedIn Jobs',
      description: 'Find official job and internship postings with verified application channels.',
      url,
      queryUsed: query,
      appliedFiltersSummary: filterSummary
    };
  }

  /**
   * 2. Official LinkedIn Posts Search (Finding active hiring posts)
   */
  static buildPostSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildNaturalQuery(criteria, 'posts');
    const params = new URLSearchParams();
    params.set('keywords', query);
    params.set('sortBy', '"date_posted"');

    const url = `https://www.linkedin.com/search/results/content/?${params.toString()}`;

    return {
      category: 'posts',
      label: 'LinkedIn Job Posts',
      description: 'Discover active hiring posts from founders, recruiters, and engineering managers.',
      url,
      queryUsed: query,
      appliedFiltersSummary: ['Sorted by: Latest Posts', `Keywords: ${query}`]
    };
  }

  /**
   * 3. Official LinkedIn People/Recruiter Search
   */
  static buildPeopleSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildNaturalQuery(criteria, 'people');
    const params = new URLSearchParams();
    params.set('keywords', query);

    const url = `https://www.linkedin.com/search/results/people/?${params.toString()}`;

    return {
      category: 'people',
      label: 'Recruiters & People',
      description: 'Connect directly with technical recruiters, hiring managers, and alumni in your target field.',
      url,
      queryUsed: query,
      appliedFiltersSummary: [`Target: Recruiters & Hiring Managers`, `Query: ${query}`]
    };
  }

  /**
   * 4. Official LinkedIn Companies Search
   */
  static buildCompanySearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildNaturalQuery(criteria, 'companies');
    const params = new URLSearchParams();
    params.set('keywords', query || criteria.role || 'Tech');

    const url = `https://www.linkedin.com/search/results/companies/?${params.toString()}`;

    return {
      category: 'companies',
      label: 'Companies',
      description: 'Discover organizations hiring in your industry, explore their culture and open headcounts.',
      url,
      queryUsed: query,
      appliedFiltersSummary: [`Industry/Role: ${query}`]
    };
  }

  /**
   * 5. Official LinkedIn Events Search
   */
  static buildEventSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildNaturalQuery(criteria, 'events');
    const params = new URLSearchParams();
    params.set('keywords', query || 'Career Tech');

    const url = `https://www.linkedin.com/search/results/events/?${params.toString()}`;

    return {
      category: 'events',
      label: 'LinkedIn Events',
      description: 'Attend industry webinars, hiring hackathons, and virtual career fairs.',
      url,
      queryUsed: query,
      appliedFiltersSummary: [`Topic: ${query}`]
    };
  }

  /**
   * 6. Official LinkedIn Learning/Courses Search
   */
  static buildCourseSearch(criteria: SearchCriteria): OptimizedSearchResult {
    const query = this.buildNaturalQuery(criteria, 'courses');
    const params = new URLSearchParams();
    params.set('keywords', query || criteria.role || 'Software Engineering');

    const url = `https://www.linkedin.com/learning/search?${params.toString()}`;

    return {
      category: 'courses',
      label: 'LinkedIn Courses',
      description: 'Skill up on relevant technologies and earn verified badges for your profile.',
      url,
      queryUsed: query,
      appliedFiltersSummary: [`Skill Focus: ${query}`]
    };
  }

  /**
   * 7. All-in-One: Build all search destinations for the current criteria
   */
  static buildAllSearches(criteria: SearchCriteria): OptimizedSearchResult[] {
    return [
      this.buildJobSearch(criteria),
      this.buildPostSearch(criteria),
      this.buildPeopleSearch(criteria),
      this.buildCompanySearch(criteria),
      this.buildEventSearch(criteria),
      this.buildCourseSearch(criteria)
    ];
  }
}
