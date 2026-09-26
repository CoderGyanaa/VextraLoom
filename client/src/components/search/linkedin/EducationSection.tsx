import React, { useState } from 'react';
import { GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../../ui/Input';
import { SearchCriteria } from '../../../services/search/types';

interface EducationSectionProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
}

const COMMON_DEGREES = [
  'B.Tech / B.E.', 'BCA', 'B.Sc.', 'B.Com', 'BBA', 'MCA', 'M.Tech / M.E.', 'M.Sc.', 'MBA', 'Diploma', 'Other'
];

const COMMON_BRANCHES = [
  'Computer Science', 'Information Technology', 'Data Science', 'Artificial Intelligence',
  'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Business / Management', 'Other'
];

const currentYear = new Date().getFullYear();
const GRADUATION_YEARS = Array.from({ length: 8 }, (_, i) => (currentYear - 2 + i).toString());

export const EducationSection: React.FC<EducationSectionProps> = ({
  criteria,
  setCriteria
}) => {
  const [showAdvancedEdu, setShowAdvancedEdu] = useState(false);

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-accent-secondary" />
          <h3 className="font-semibold text-sm text-text-primary">Education & Student Context</h3>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={criteria.education?.includeInQuery ?? true}
            onChange={e => setCriteria(prev => ({
              ...prev,
              education: {
                ...prev.education,
                includeInQuery: e.target.checked
              }
            }))}
            className="rounded border-border text-accent-primary focus:ring-accent-primary"
          />
          <span className="text-text-secondary">Include in search intent</span>
        </label>
      </div>

      {/* Degree, Branch, Graduation Year */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label htmlFor="degree-select" className="text-xs font-medium text-text-secondary">Degree</label>
          <select
            id="degree-select"
            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={criteria.education?.degree || ''}
            onChange={e => setCriteria(prev => ({
              ...prev,
              education: { ...prev.education, degree: e.target.value }
            }))}
          >
            <option value="">Select Degree</option>
            {COMMON_DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="field-select" className="text-xs font-medium text-text-secondary">Branch / Field</label>
          <select
            id="field-select"
            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={criteria.education?.field || ''}
            onChange={e => setCriteria(prev => ({
              ...prev,
              education: { ...prev.education, field: e.target.value }
            }))}
          >
            <option value="">Select Field</option>
            {COMMON_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="grad-year-select" className="text-xs font-medium text-text-secondary">Graduation Year</label>
          <select
            id="grad-year-select"
            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={criteria.education?.graduationYear || ''}
            onChange={e => setCriteria(prev => ({
              ...prev,
              education: { ...prev.education, graduationYear: e.target.value }
            }))}
          >
            <option value="">Graduation Year</option>
            {GRADUATION_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Progressive Disclosure: College & Study Status */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvancedEdu(!showAdvancedEdu)}
          className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center gap-1 transition-colors"
        >
          <span>{showAdvancedEdu ? 'Hide extra details' : '+ Add college / study status'}</span>
          {showAdvancedEdu ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvancedEdu && (
          <div className="grid sm:grid-cols-2 gap-3 pt-3 animate-fade-in border-t border-border/40 mt-2">
            <div className="space-y-1">
              <label htmlFor="college-input" className="text-xs font-medium text-text-secondary">College / University</label>
              <Input
                id="college-input"
                placeholder="e.g. State University, IIT, NIT"
                value={criteria.education?.college || ''}
                onChange={e => setCriteria(prev => ({
                  ...prev,
                  education: { ...prev.education, college: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="status-select" className="text-xs font-medium text-text-secondary">Study Status</label>
              <select
                id="status-select"
                className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                value={criteria.education?.studyStatus || ''}
                onChange={e => setCriteria(prev => ({
                  ...prev,
                  education: { ...prev.education, studyStatus: e.target.value }
                }))}
              >
                <option value="">Select Status</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Recently Graduated">Recently Graduated</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
