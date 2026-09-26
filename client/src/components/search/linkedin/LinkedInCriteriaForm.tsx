import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { SearchCriteria } from '../../../services/search/types';
import { RoleAndSynonymsSection } from './RoleAndSynonymsSection';
import { SkillsAndCompaniesSection } from './SkillsAndCompaniesSection';
import { EducationSection } from './EducationSection';
import { LocationAndFiltersSection } from './LocationAndFiltersSection';

interface LinkedInCriteriaFormProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
}

export const LinkedInCriteriaForm: React.FC<LinkedInCriteriaFormProps> = ({
  criteria,
  setCriteria
}) => {
  return (
    <div className="space-y-6">
      {/* Search Mode Selector (Smart Search PRIMARY & DEFAULT) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-muted uppercase font-semibold">Mode:</span>
          <div className="inline-flex p-1 rounded-xl bg-surface-elevated border border-border">
            <button
              type="button"
              onClick={() => setCriteria(prev => ({ ...prev, searchMode: 'smart' }))}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                criteria.searchMode !== 'boolean'
                  ? 'bg-accent-primary text-background font-bold shadow-glow-primary/20'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Search (Natural Intent)</span>
            </button>
            <button
              type="button"
              onClick={() => setCriteria(prev => ({ ...prev, searchMode: 'boolean' }))}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                criteria.searchMode === 'boolean'
                  ? 'bg-accent-secondary text-white font-bold shadow-glow-secondary/20'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Advanced: Precision Boolean Mode</span>
            </button>
          </div>
        </div>

        <span className="text-[11px] text-text-muted font-mono self-start sm:self-center">
          {criteria.searchMode === 'boolean' 
            ? 'Exact operators (AND, OR, NOT, quotes)' 
            : 'AI-tailored natural intent for LinkedIn semantic search'}
        </span>
      </div>

      {/* Progressive Disclosure Sections */}
      <RoleAndSynonymsSection criteria={criteria} setCriteria={setCriteria} />
      <SkillsAndCompaniesSection criteria={criteria} setCriteria={setCriteria} />
      <EducationSection criteria={criteria} setCriteria={setCriteria} />
      <LocationAndFiltersSection criteria={criteria} setCriteria={setCriteria} />
    </div>
  );
};
