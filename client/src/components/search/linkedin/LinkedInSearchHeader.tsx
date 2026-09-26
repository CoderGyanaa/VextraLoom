import React from 'react';
import { Sparkles, UserCircle, Briefcase, GraduationCap, MapPin, Search } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { STUDENT_PRESETS } from '../../../services/search/searchStorage';

interface LinkedInSearchHeaderProps {
  isAuthenticated: boolean;
  onApplyPreset: (presetName: string) => void;
  onUseProfile: () => void;
}

const PRESET_ICONS: Record<string, React.ElementType> = {
  'B.Tech Fresher': GraduationCap,
  'MCA Fresher': GraduationCap,
  'Final-Year Student': Briefcase,
  '2026 Graduate': GraduationCap,
  'Internship for Students': Search,
  'Entry-Level Jobs': MapPin
};

export const LinkedInSearchHeader: React.FC<LinkedInSearchHeaderProps> = ({
  isAuthenticated,
  onApplyPreset,
  onUseProfile
}) => {
  return (
    <div className="space-y-6 pb-6 border-b border-border/60">
      {/* Title & Badge */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LINKEDIN SEARCH HUB • PUBLIC & GUEST ACCESSIBLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            LinkedIn Search Hub
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
            Construct high-precision LinkedIn search intent and filters from your career goals, education, and skills.
            VEXTRALOOM structures your intent before opening the official LinkedIn destination.
          </p>
          <p className="text-[11px] text-text-muted mt-2 font-mono">
            * VEXTRALOOM does not scrape or control LinkedIn's internal ranking algorithm. Results open directly on official LinkedIn domains.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start shrink-0">
          <Badge variant={isAuthenticated ? 'success' : 'outline'} className="text-xs py-1">
            {isAuthenticated ? 'Profile Linked' : 'Guest Mode (No Login Required)'}
          </Badge>
        </div>
      </div>

      {/* Presets and Profile Prefill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface border border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-text-muted uppercase font-semibold mr-1">Quick Presets:</span>
          {Object.keys(STUDENT_PRESETS).slice(0, 4).map(name => {
            const Icon = PRESET_ICONS[name] || Briefcase;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onApplyPreset(name)}
                className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border hover:border-accent-primary/50 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all flex items-center gap-1.5"
              >
                <Icon className="w-3 h-3 text-accent-primary" />
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={onUseProfile}
            className="px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-accent-primary hover:bg-accent-primary/20 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Pre-fill search criteria from your career profile without modifying the saved profile"
          >
            <UserCircle className="w-3.5 h-3.5" />
            <span>Use My Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};
