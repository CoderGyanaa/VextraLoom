import React, { useState } from 'react';
import { MapPin, Briefcase, Calendar, ChevronDown, ChevronUp, Sparkles, ExternalLink } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { SaveButton } from './SaveButton';
import { useAuth } from '../../context/AuthContext';

export interface OpportunityCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  workMode?: 'Remote' | 'Hybrid' | 'On-site';
  deadline?: string;
  skills?: string[];
  matchScore?: number;
  matchReasons?: string[];
  skillGaps?: string[];
  applyUrl?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  company,
  location,
  salary,
  workMode = 'On-site',
  deadline = 'Apply soon',
  skills = ['Java', 'Spring Boot', 'SQL'],
  matchScore,
  matchReasons = ['Matches your interest in backend engineering', 'Aligns with your primary skills'],
  skillGaps = ['Docker / Kubernetes basics'],
  applyUrl = '#'
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:border-border/80">
      <CardContent className="p-5">
        {/* Top Header: Company, Location, Save */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-mono text-accent-primary font-medium tracking-wide uppercase">
              {company}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-text-primary mt-0.5">
              {title}
            </h3>
          </div>
          <SaveButton itemTitle={`${title} at ${company}`} />
        </div>

        {/* PRIMARY INFO: Location, Salary, Work Mode */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-text-secondary mb-4">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-text-muted" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-text-primary">
            <Briefcase className="w-3.5 h-3.5 text-text-muted" />
            {salary}
          </span>
          <Badge variant="outline" className="text-[10px] py-0 px-2">
            {workMode}
          </Badge>
          <span className="inline-flex items-center gap-1 text-text-muted ml-auto sm:ml-0">
            <Calendar className="w-3 h-3" />
            {deadline}
          </span>
        </div>

        {/* SECONDARY INFO: Skills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {skills.map(skill => (
            <span 
              key={skill} 
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface border border-border text-text-secondary"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* ADVANCED / PROGRESSIVE DISCLOSURE: Match Insights */}
        {showAdvanced && (
          <div className="pt-3 pb-2 mb-3 border-t border-border/60 text-xs space-y-2 animate-fade-in">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                    Personal Match Analysis
                  </span>
                  {matchScore && (
                    <span className="font-mono font-bold text-accent-primary">
                      {matchScore}% Match
                    </span>
                  )}
                </div>
                <ul className="space-y-1 text-text-secondary pl-5 list-disc text-[11px]">
                  {matchReasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
                {skillGaps.length > 0 && (
                  <div className="text-[11px] text-text-muted">
                    <span className="text-warning font-medium">Suggested Prep: </span>
                    {skillGaps.join(', ')}
                  </div>
                )}
              </>
            ) : (
              <div className="p-3 rounded-lg bg-surface border border-border text-center">
                <p className="text-xs text-text-secondary mb-1">
                  <span className="text-accent-primary font-semibold">Sign in</span> to view personalized match analysis and skill gaps for this role.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-text-muted hover:text-text-primary inline-flex items-center gap-1 transition-colors"
          >
            <span>{showAdvanced ? 'Hide Match Details' : 'Match Details & Skills'}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <Button 
            size="sm" 
            variant="primary"
            className="gap-1.5 text-xs"
            onClick={() => window.open(applyUrl, '_blank', 'noopener,noreferrer')}
          >
            Apply <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
