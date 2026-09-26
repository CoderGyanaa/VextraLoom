import React, { useState } from 'react';
import { Briefcase, Sliders, ShieldAlert } from 'lucide-react';
import { Input } from '../../ui/Input';
import { SearchCriteria } from '../../../services/search/types';
import { BRANCH_SUGGESTIONS } from '../../../services/search/searchStorage';

interface RoleAndSynonymsSectionProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
}

export const RoleAndSynonymsSection: React.FC<RoleAndSynonymsSectionProps> = ({
  criteria,
  setCriteria
}) => {
  const [showSynonymPanel, setShowSynonymPanel] = useState(false);
  const [synonymInput, setSynonymInput] = useState('');

  const suggestedRoles = criteria.education?.field
    ? (BRANCH_SUGGESTIONS[criteria.education.field] || [])
    : [];

  const handleAddSynonym = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && synonymInput.trim()) {
      e.preventDefault();
      const newSyn = synonymInput.trim();
      const current = criteria.synonyms || [];
      if (!current.includes(newSyn)) {
        setCriteria(prev => ({ ...prev, synonyms: [...current, newSyn] }));
      }
      setSynonymInput('');
    }
  };

  const removeSynonym = (synToRemove: string) => {
    setCriteria(prev => ({
      ...prev,
      synonyms: (prev.synonyms || []).filter(s => s !== synToRemove)
    }));
  };

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-accent-primary" />
          <h3 className="font-semibold text-sm text-text-primary">Career Target & Role</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowSynonymPanel(!showSynonymPanel)}
          className="text-xs text-text-secondary hover:text-accent-primary flex items-center gap-1 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showSynonymPanel ? 'Hide Synonyms' : 'Synonym Expansion'}</span>
        </button>
      </div>

      {/* Target Role Input */}
      <div className="space-y-1.5">
        <label htmlFor="target-role-input" className="text-xs font-medium text-text-secondary">
          Target Role <span className="text-error">*</span>
        </label>
        <Input
          id="target-role-input"
          placeholder="e.g. Java Developer, Frontend Engineer, Cloud Trainee"
          value={criteria.role}
          onChange={e => setCriteria(prev => ({ ...prev, role: e.target.value }))}
        />
        {suggestedRoles.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
            <span className="text-[11px] text-text-muted">Branch Suggestions:</span>
            {suggestedRoles.slice(0, 4).map(sRole => (
              <button
                key={sRole}
                type="button"
                onClick={() => setCriteria(prev => ({ ...prev, role: sRole }))}
                className="text-[11px] px-2 py-0.5 rounded bg-surface-elevated border border-border text-text-secondary hover:text-accent-primary hover:border-accent-primary/40 transition-colors"
              >
                + {sRole}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Controlled Synonym Expansion Panel */}
      {showSynonymPanel && (
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary">Role Synonym Expansion</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.useSynonyms ?? true}
                onChange={e => setCriteria(prev => ({ ...prev, useSynonyms: e.target.checked }))}
                className="rounded border-border text-accent-primary focus:ring-accent-primary"
              />
              <span className="text-text-muted">Enable in Intent</span>
            </label>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Includes equivalent role titles without diluting your primary search intent.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(criteria.synonyms || []).map(syn => (
              <span
                key={syn}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface border border-border font-mono text-[11px] text-text-secondary"
              >
                {syn}
                <button
                  type="button"
                  onClick={() => removeSynonym(syn)}
                  className="text-text-muted hover:text-error ml-1 font-bold"
                  aria-label={`Remove synonym ${syn}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <input
              placeholder="Add custom synonym and press Enter"
              className="flex-1 bg-surface border border-border rounded px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
              value={synonymInput}
              onChange={e => setSynonymInput(e.target.value)}
              onKeyDown={handleAddSynonym}
            />
          </div>
        </div>
      )}

      {/* Senior Exclusions Toggle (OFF by default) */}
      <div className="pt-2 border-t border-border/40">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={criteria.excludeSeniorRoles ?? false}
            onChange={e => setCriteria(prev => ({ ...prev, excludeSeniorRoles: e.target.checked }))}
            className="mt-0.5 rounded border-border text-accent-secondary focus:ring-accent-secondary"
          />
          <div>
            <span className="font-semibold text-text-primary flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-warning" />
              Exclude Senior & Management Roles
            </span>
            <p className="text-text-muted text-[11px] mt-0.5">
              Only applies when enabled: adds Boolean exclusion <code className="font-mono text-warning">NOT (Senior OR Lead OR Manager OR Architect)</code> in Precision Mode.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
