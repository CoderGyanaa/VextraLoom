import React, { useState } from 'react';
import { Layers, Building, Star, Info } from 'lucide-react';
import { Input } from '../../ui/Input';
import { SearchCriteria } from '../../../services/search/types';
import { LinkedInSearchAdapter } from '../../../services/search/linkedinAdapter';

interface SkillsAndCompaniesSectionProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
}

export const SkillsAndCompaniesSection: React.FC<SkillsAndCompaniesSectionProps> = ({
  criteria,
  setCriteria
}) => {
  const [skillInput, setSkillInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');

  const { core, supporting } = LinkedInSearchAdapter.getCoreAndSupportingSkills(criteria);

  // Add skill
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(/^,+|,+$/g, '');
      if (newSkill && !criteria.skills.includes(newSkill)) {
        const nextSkills = [...criteria.skills, newSkill];
        setCriteria(prev => ({
          ...prev,
          skills: nextSkills,
          coreSkills: nextSkills.slice(0, 3),
          supportingSkills: nextSkills.slice(3)
        }));
      }
      setSkillInput('');
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    const nextSkills = criteria.skills.filter(s => s !== skillToRemove);
    setCriteria(prev => ({
      ...prev,
      skills: nextSkills,
      coreSkills: (prev.coreSkills || []).filter(s => s !== skillToRemove).slice(0, 3),
      supportingSkills: (prev.supportingSkills || []).filter(s => s !== skillToRemove)
    }));
  };

  // Promote supporting skill to core (swap with last core)
  const promoteToCore = (skill: string) => {
    const currentCore = [...core];
    const currentSupporting = [...supporting];
    const supportingIdx = currentSupporting.indexOf(skill);
    if (supportingIdx > -1) {
      currentSupporting.splice(supportingIdx, 1);
      if (currentCore.length >= 3) {
        const popped = currentCore.pop();
        if (popped) currentSupporting.unshift(popped);
      }
      currentCore.push(skill);
      setCriteria(prev => ({
        ...prev,
        coreSkills: currentCore,
        supportingSkills: currentSupporting
      }));
    }
  };

  // Demote core skill to supporting
  const demoteToSupporting = (skill: string) => {
    const currentCore = core.filter(s => s !== skill);
    const currentSupporting = [skill, ...supporting];
    setCriteria(prev => ({
      ...prev,
      coreSkills: currentCore,
      supportingSkills: currentSupporting
    }));
  };

  // Add Company
  const handleAddCompany = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && companyInput.trim()) {
      e.preventDefault();
      const newComp = companyInput.trim();
      const current = criteria.targetCompanies || [];
      if (!current.includes(newComp)) {
        const nextComps = [...current, newComp];
        setCriteria(prev => ({
          ...prev,
          targetCompanies: nextComps,
          company: nextComps[0] || ''
        }));
      }
      setCompanyInput('');
    }
  };

  // Remove Company
  const removeCompany = (compToRemove: string) => {
    const nextComps = (criteria.targetCompanies || []).filter(c => c !== compToRemove);
    setCriteria(prev => ({
      ...prev,
      targetCompanies: nextComps,
      company: nextComps[0] || ''
    }));
  };

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border space-y-5">
      {/* 1. Skills Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-primary" />
          <h3 className="font-semibold text-sm text-text-primary">Skills (Core vs. Supporting)</h3>
        </div>
        <span className="text-[10px] font-mono text-text-muted">Max 3 Core Skills in Query</span>
      </div>

      {/* Skills Input */}
      <div className="space-y-2">
        <label htmlFor="skill-input" className="text-xs font-medium text-text-secondary">
          Add Skills (Press Enter or comma to add)
        </label>
        <Input
          id="skill-input"
          placeholder="e.g. Java, Spring Boot, SQL, Docker, AWS"
          value={skillInput}
          onChange={e => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
        />

        {/* Informative banner if > 3 skills */}
        {criteria.skills.length > 3 && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-elevated border border-border text-[11px] text-text-secondary">
            <Info className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your search contains {criteria.skills.length} skills. We've prioritized your top 3 core skills to keep search intent focused on LinkedIn. Supporting skills remain saved for your reference.
            </p>
          </div>
        )}

        {/* Core Skills Group */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-accent-primary flex items-center gap-1 font-mono">
              <Star className="w-3 h-3 fill-accent-primary text-accent-primary" />
              Core Skills ({core.length}/3) • Active in Search Intent
            </span>
          </div>
          {core.length === 0 ? (
            <p className="text-[11px] text-text-muted italic">No core skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {core.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/40 text-xs font-medium text-accent-primary"
                >
                  <Star className="w-3 h-3 fill-accent-primary text-accent-primary" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => demoteToSupporting(skill)}
                    className="text-[10px] text-accent-primary/70 hover:text-text-primary px-1 hover:bg-accent-primary/20 rounded"
                    title="Make supporting skill"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-text-muted hover:text-error ml-0.5 font-bold"
                    aria-label={`Remove skill ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Supporting Skills Group */}
        {supporting.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <span className="text-xs font-semibold text-text-secondary font-mono">
              Supporting Skills ({supporting.length}) • Not in Search String
            </span>
            <div className="flex flex-wrap gap-1.5">
              {supporting.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-xs text-text-secondary"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => promoteToCore(skill)}
                    className="text-[10px] text-text-muted hover:text-accent-primary px-1 hover:bg-surface rounded"
                    title="Promote to Core Skill"
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-text-muted hover:text-error ml-0.5 font-bold"
                    aria-label={`Remove skill ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Target Companies */}
      <div className="space-y-2 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-accent-secondary" />
            <label htmlFor="company-input" className="text-xs font-semibold text-text-primary">
              Target Companies (Optional)
            </label>
          </div>
          <span className="text-[10px] text-text-muted font-mono">Multiple allowed</span>
        </div>
        <Input
          id="company-input"
          placeholder="Type company & press Enter (e.g. Google, Microsoft, Infosys)"
          value={companyInput}
          onChange={e => setCompanyInput(e.target.value)}
          onKeyDown={handleAddCompany}
        />
        {(criteria.targetCompanies || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(criteria.targetCompanies || []).map(comp => (
              <span
                key={comp}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-xs font-medium text-text-primary"
              >
                <span>{comp}</span>
                <button
                  type="button"
                  onClick={() => removeCompany(comp)}
                  className="text-text-muted hover:text-error ml-1 font-bold"
                  aria-label={`Remove company ${comp}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
