import React, { useState } from 'react';
import { 
  Sparkles, Terminal, Copy, Check, Info, AlertTriangle, 
  MapPin, GraduationCap, Building, ExternalLink, Bookmark
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Card, CardContent } from '../../ui/Card';
import { SearchCriteria, OptimizedSearchResult } from '../../../services/search/types';
import { LinkedInSearchAdapter } from '../../../services/search/linkedinAdapter';

interface LinkedInSearchPreviewProps {
  criteria: SearchCriteria;
  singleResult: OptimizedSearchResult;
  onLaunchSearch: (result: OptimizedSearchResult) => void;
  onSaveSearch: () => void;
  saveSuccessMsg: string;
}

export const LinkedInSearchPreview: React.FC<LinkedInSearchPreviewProps> = ({
  criteria,
  singleResult,
  onLaunchSearch,
  onSaveSearch,
  saveSuccessMsg
}) => {
  const [copied, setCopied] = useState(false);

  const smartIntent = LinkedInSearchAdapter.buildSmartJobQuery(criteria);
  const booleanQuery = LinkedInSearchAdapter.buildBooleanJobQuery(criteria);
  const healthItems = LinkedInSearchAdapter.analyzeQueryHealth(criteria);
  const { core, supporting } = LinkedInSearchAdapter.getCoreAndSupportingSkills(criteria);
  const companies = LinkedInSearchAdapter.getTargetCompanies(criteria);

  const activeQuery = criteria.searchMode === 'boolean' ? booleanQuery : smartIntent;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-accent-primary/40 shadow-glow-primary/10 relative overflow-hidden bg-surface-elevated">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Title and Active Mode Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-accent-primary font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            SEARCH INTENT PREVIEW
          </span>
          <Badge
            variant={criteria.searchMode === 'boolean' ? 'warning' : 'success'}
            className="text-[10px] uppercase font-mono"
          >
            {criteria.searchMode === 'boolean' ? 'PRECISION BOOLEAN' : 'SMART INTENT'}
          </Badge>
        </div>

        {/* 1. Summary of Configured Criteria */}
        <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2 text-xs">
          <div className="flex items-center justify-between text-text-muted font-mono uppercase text-[10px]">
            <span>YOUR SEARCH CONFIGURATION</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span className="font-bold text-sm text-text-primary w-full mb-1">
              {criteria.role || 'No role specified'}
            </span>

            {criteria.location && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] text-text-secondary">
                <MapPin className="w-3 h-3 text-success" />
                {criteria.location}
              </span>
            )}

            {criteria.experience !== 'any' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] text-text-secondary capitalize">
                {criteria.experience.replace('_', ' ')}
              </span>
            )}

            {criteria.education?.includeInQuery && criteria.education.degree && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] text-text-secondary">
                <GraduationCap className="w-3 h-3 text-accent-secondary" />
                {criteria.education.degree} {criteria.education.field || ''}
              </span>
            )}

            {criteria.workMode !== 'any' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] text-text-secondary capitalize">
                {criteria.workMode}
              </span>
            )}

            {criteria.employmentType !== 'any' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] text-text-secondary capitalize">
                {criteria.employmentType.replace('_', ' ')}
              </span>
            )}

            {criteria.datePosted !== 'any' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] text-text-secondary">
                {criteria.datePosted.replace('_', ' ')}
              </span>
            )}

            {companies.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] text-text-secondary">
                <Building className="w-3 h-3 text-accent-primary" />
                {companies.join(', ')}
              </span>
            )}
          </div>

          {/* Skills Breakdown */}
          {core.length > 0 && (
            <div className="pt-2 border-t border-border/40 text-[11px] text-text-secondary">
              <span className="font-semibold text-accent-primary">Core Skills: </span>
              {core.join(' · ')}
              {supporting.length > 0 && (
                <span className="text-text-muted"> (Supporting: {supporting.join(', ')})</span>
              )}
            </div>
          )}
        </div>

        {/* 2. Query Health Guidance (Non-intrusive) */}
        {healthItems.length > 0 && (
          <div className="space-y-2">
            {healthItems.map(item => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  item.type === 'warning'
                    ? 'bg-warning/10 border-warning/30 text-warning'
                    : 'bg-surface border-border text-text-secondary'
                }`}
              >
                {item.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-warning" />
                ) : (
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-accent-primary" />
                )}
                <div className="min-w-0">
                  <p className="leading-relaxed">{item.message}</p>
                  {item.suggestion && (
                    <p className="text-[11px] text-text-muted mt-0.5">{item.suggestion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Primary Intent Display (Smart Natural Language) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-accent-primary font-mono font-semibold uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              SMART SEARCH INTENT (DEFAULT)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(smartIntent)}
              className="text-text-secondary hover:text-accent-primary inline-flex items-center gap-1 transition-colors text-[11px]"
            >
              {copied && activeQuery === smartIntent ? (
                <Check className="w-3 h-3 text-success" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copied && activeQuery === smartIntent ? 'Copied' : 'Copy Intent'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-surface border border-border text-xs leading-relaxed text-text-primary break-words">
            "{smartIntent || 'Please enter a target role to generate intent.'}"
          </div>
        </div>

        {/* 4. Precision Boolean Display (When in Boolean Mode) */}
        {criteria.searchMode === 'boolean' && (
          <div className="space-y-1.5 pt-1 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="text-accent-secondary font-mono font-semibold uppercase flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                PRECISION BOOLEAN QUERY (ADVANCED)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(booleanQuery)}
                className="text-text-secondary hover:text-accent-primary inline-flex items-center gap-1 transition-colors text-[11px]"
              >
                {copied && activeQuery === booleanQuery ? (
                  <Check className="w-3 h-3 text-success" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copied && activeQuery === booleanQuery ? 'Copied' : 'Copy Boolean'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-accent-secondary/30 text-xs font-mono text-accent-secondary leading-relaxed break-words">
              {booleanQuery || 'No boolean query available.'}
            </div>
          </div>
        )}

        {/* Action Button: Open Official Destination */}
        <Button
          size="lg"
          variant="primary"
          className="w-full gap-2 justify-center shadow-glow-primary/30"
          onClick={() => onLaunchSearch(singleResult)}
        >
          <span>{singleResult.actionText || `Open ${singleResult.label} on LinkedIn`}</span>
          <ExternalLink className="w-4 h-4" />
        </Button>

        {/* Save Search Link */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-text-secondary hover:text-text-primary gap-1.5"
            onClick={onSaveSearch}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save this search</span>
          </Button>
          <span className="text-[11px] text-text-muted">Direct Official Tab</span>
        </div>

        {saveSuccessMsg && (
          <div className="p-2.5 rounded-lg bg-success/10 border border-success/30 text-xs text-success text-center">
            ✓ {saveSuccessMsg}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
