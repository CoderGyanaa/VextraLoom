import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '../../ui/Input';
import { SearchCriteria } from '../../../services/search/types';

interface LocationAndFiltersSectionProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
}

export const LocationAndFiltersSection: React.FC<LocationAndFiltersSectionProps> = ({
  criteria,
  setCriteria
}) => {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-success" />
          <h3 className="font-semibold text-sm text-text-primary">Location & Native LinkedIn Filters</h3>
        </div>
        <span className="text-[10px] font-mono text-text-muted">Direct LinkedIn Parameters</span>
      </div>

      {/* Location & Work Mode */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="location-input" className="text-xs font-medium text-text-secondary">Location</label>
          <Input
            id="location-input"
            placeholder="e.g. Bengaluru, India or Remote"
            value={criteria.location}
            onChange={e => setCriteria(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="work-mode-select" className="text-xs font-medium text-text-secondary">Work Mode</label>
          <select
            id="work-mode-select"
            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={criteria.workMode}
            onChange={e => setCriteria(prev => ({ ...prev, workMode: e.target.value as any }))}
          >
            <option value="any">Any Work Mode</option>
            <option value="remote">Remote (f_WT=2)</option>
            <option value="hybrid">Hybrid (f_WT=3)</option>
            <option value="onsite">On-site (f_WT=1)</option>
          </select>
        </div>
      </div>

      {/* Experience, Employment Type, Date Posted */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label htmlFor="exp-select" className="text-xs font-medium text-text-secondary">Experience</label>
          <select
            id="exp-select"
            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={criteria.experience}
            onChange={e => setCriteria(prev => ({ ...prev, experience: e.target.value as any }))}
          >
            <option value="student">Student / Intern (f_E=1)</option>
            <option value="fresher">Fresher / Entry (f_E=1,2)</option>
            <option value="entry_level">Entry Level (f_E=2)</option>
            <option value="associate">Associate (f_E=3)</option>
            <option value="mid_level">Mid-Senior (f_E=4)</option>
            <option value="any">Any Experience</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="employment-select" className="text-xs font-medium text-text-secondary">Employment Type</label>
          <select
            id="employment-select"
            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={criteria.employmentType}
            onChange={e => setCriteria(prev => ({ ...prev, employmentType: e.target.value as any }))}
          >
            <option value="full_time">Full-time (f_JT=F)</option>
            <option value="internship">Internship (f_JT=I)</option>
            <option value="part_time">Part-time (f_JT=P)</option>
            <option value="contract">Contract (f_JT=C)</option>
            <option value="any">Any Employment</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="date-select" className="text-xs font-medium text-text-secondary">Posted Within</label>
          <select
            id="date-select"
            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={criteria.datePosted}
            onChange={e => setCriteria(prev => ({ ...prev, datePosted: e.target.value as any }))}
          >
            <option value="past_24h">Past 24 hours (f_TPR=r86400)</option>
            <option value="past_week">Past 7 days (f_TPR=r604800)</option>
            <option value="past_month">Past 30 days (f_TPR=r2592000)</option>
            <option value="any">Any time</option>
          </select>
        </div>
      </div>

      {/* Easy Apply & Under 10 Applicants */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-border/40 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={criteria.easyApplyOnly}
            onChange={e => setCriteria(prev => ({ ...prev, easyApplyOnly: e.target.checked }))}
            className="rounded border-border text-accent-primary focus:ring-accent-primary"
          />
          <span className="text-text-secondary">Easy Apply only (f_AL=true)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={criteria.under10Applicants}
            onChange={e => setCriteria(prev => ({ ...prev, under10Applicants: e.target.checked }))}
            className="rounded border-border text-accent-primary focus:ring-accent-primary"
          />
          <span className="text-text-secondary">Under 10 Applicants (f_EA=true)</span>
        </label>
      </div>

      <p className="text-[11px] text-text-muted italic pt-1">
        * Dedicated filters are offloaded directly to LinkedIn's URL parameters and kept separate from keyword search to maximize match recall.
      </p>
    </div>
  );
};
