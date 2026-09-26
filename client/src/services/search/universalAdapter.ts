import { SearchCriteria } from './types';
import { LinkedInSearchAdapter } from './linkedinAdapter';

export interface SearchSource {
  id: string;
  name: string;
  domain: string;
  category: 'primary' | 'secondary' | 'fallback';
  enabled: boolean;
  supportedFilters: string[]; 
  buildSearchUrl: (criteria: SearchCriteria) => string;
}

export class UniversalSearchAdapter {
  
  static buildBaseQuery(criteria: SearchCriteria): string {
    const parts: string[] = [];
    if (criteria.role) parts.push(criteria.role);
    if (criteria.skills && criteria.skills.length > 0) {
      parts.push(criteria.skills.join(' '));
    }
    if (criteria.targetCompanies && criteria.targetCompanies.length > 0) {
      parts.push(criteria.targetCompanies.join(' '));
    }
    return parts.join(' ');
  }

  static getSources(): SearchSource[] {
    return [
      {
        id: 'linkedin',
        name: 'LinkedIn',
        domain: 'linkedin.com',
        category: 'primary',
        enabled: true,
        supportedFilters: ['role', 'location', 'skills', 'experience', 'workMode', 'datePosted', 'employmentType'],
        buildSearchUrl: (criteria: SearchCriteria) => {
          return LinkedInSearchAdapter.buildSearchPack(criteria).jobs.url;
        }
      },
      {
        id: 'indeed',
        name: 'Indeed',
        domain: 'indeed.com',
        category: 'primary',
        enabled: true,
        supportedFilters: ['role', 'location', 'skills', 'companies'],
        buildSearchUrl: (criteria: SearchCriteria) => {
          const q = encodeURIComponent(this.buildBaseQuery(criteria));
          const l = encodeURIComponent(criteria.location || '');
          return `https://in.indeed.com/jobs?q=${q}&l=${l}`;
        }
      },
      {
        id: 'naukri',
        name: 'Naukri',
        domain: 'naukri.com',
        category: 'primary',
        enabled: true,
        supportedFilters: ['role', 'location', 'skills', 'experience'],
        buildSearchUrl: (criteria: SearchCriteria) => {
          let q = this.buildBaseQuery(criteria).replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
          let l = (criteria.location || '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
          if (!q) q = 'jobs';
          if (l) return `https://www.naukri.com/${q}-jobs-in-${l}`;
          return `https://www.naukri.com/${q}-jobs`;
        }
      },
      {
        id: 'foundit',
        name: 'Foundit',
        domain: 'foundit.in',
        category: 'primary',
        enabled: true,
        supportedFilters: ['role', 'location', 'skills'],
        buildSearchUrl: (criteria: SearchCriteria) => {
          const q = encodeURIComponent(this.buildBaseQuery(criteria));
          const l = encodeURIComponent(criteria.location || '');
          return `https://www.foundit.in/srp/results?query=${q}&locations=${l}`;
        }
      },
      {
        id: 'wellfound',
        name: 'Wellfound',
        domain: 'wellfound.com',
        category: 'secondary',
        enabled: true,
        supportedFilters: ['role', 'location'],
        buildSearchUrl: (criteria: SearchCriteria) => {
          // Wellfound doesn't have a simple URL param query structure for public logged-out users,
          // so we use a precise Google Site search as a robust adapter method.
          const q = encodeURIComponent(this.buildBaseQuery(criteria));
          const l = encodeURIComponent(criteria.location || '');
          return `https://www.google.com/search?q=site:wellfound.com/jobs+${q}+${l}`;
        }
      },
      {
        id: 'cutshort',
        name: 'Cutshort',
        domain: 'cutshort.io',
        category: 'secondary',
        enabled: true,
        supportedFilters: ['role', 'location'],
        buildSearchUrl: (criteria: SearchCriteria) => {
          const q = encodeURIComponent(this.buildBaseQuery(criteria));
          return `https://cutshort.io/jobs?q=${q}`;
        }
      },
      {
        id: 'google_jobs',
        name: 'Google Jobs',
        domain: 'google.com',
        category: 'fallback',
        enabled: true,
        supportedFilters: ['role', 'location', 'skills', 'companies'],
        buildSearchUrl: (criteria: SearchCriteria) => {
          const q = encodeURIComponent(this.buildBaseQuery(criteria) + ' jobs ' + (criteria.location || ''));
          return `https://www.google.com/search?q=${q}&ibp=htl;jobs`;
        }
      },
      {
        id: 'google_web',
        name: 'Google Web Search',
        domain: 'google.com',
        category: 'fallback',
        enabled: true,
        supportedFilters: ['role', 'location', 'skills', 'companies', 'education'],
        buildSearchUrl: (criteria: SearchCriteria) => {
          let qStr = `"${criteria.role}"`;
          if (criteria.location) qStr += ` "${criteria.location}"`;
          if (criteria.experience === 'fresher') qStr += ` fresher`;
          if (criteria.skills && criteria.skills.length > 0) qStr += ` "${criteria.skills[0]}"`;
          qStr += ` careers OR jobs`;
          return `https://www.google.com/search?q=${encodeURIComponent(qStr)}`;
        }
      }
    ];
  }

  static getUnsupportedFilters(source: SearchSource, criteria: SearchCriteria): string[] {
    const unsupported: string[] = [];
    
    // Check if criteria has values for fields the source doesn't support
    if (criteria.experience && criteria.experience !== 'any' && !source.supportedFilters.includes('experience')) {
      unsupported.push('Experience Level');
    }
    if (criteria.workMode && criteria.workMode !== 'any' && !source.supportedFilters.includes('workMode')) {
      unsupported.push('Work Mode (Remote/Hybrid)');
    }
    if (criteria.employmentType && criteria.employmentType !== 'any' && !source.supportedFilters.includes('employmentType')) {
      unsupported.push('Employment Type');
    }
    if (criteria.datePosted && criteria.datePosted !== 'any' && !source.supportedFilters.includes('datePosted')) {
      unsupported.push('Date Posted');
    }
    if (criteria.education?.degree && !source.supportedFilters.includes('education')) {
      unsupported.push('Education');
    }
    if (criteria.salaryMin && !source.supportedFilters.includes('salary')) {
      unsupported.push('Salary');
    }

    return unsupported;
  }
}
