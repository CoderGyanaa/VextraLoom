import React from 'react';
import { 
  Briefcase, Search, Users, Building, Video, BookOpen, Layers, 
  ExternalLink, Info 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { SearchCategory, SearchPack, OptimizedSearchResult } from '../../../services/search/types';

interface LinkedInDestinationGridProps {
  activeCategory: SearchCategory;
  setActiveCategory: (cat: SearchCategory) => void;
  searchPack: SearchPack;
  onLaunchSearch: (result: OptimizedSearchResult) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All-in-One Pack', icon: Layers },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'posts', label: 'Hiring Posts', icon: Search },
  { id: 'people', label: 'Recruiters', icon: Users },
  { id: 'companies', label: 'Companies', icon: Building },
  { id: 'events', label: 'Events', icon: Video },
  { id: 'courses', label: 'Courses', icon: BookOpen }
];

export const LinkedInDestinationGrid: React.FC<LinkedInDestinationGridProps> = ({
  activeCategory,
  setActiveCategory,
  searchPack,
  onLaunchSearch
}) => {
  const packItems = [
    { res: searchPack.jobs, icon: Briefcase, color: 'text-accent-primary' },
    { res: searchPack.posts, icon: Search, color: 'text-accent-secondary' },
    { res: searchPack.people, icon: Users, color: 'text-success' },
    { res: searchPack.companies, icon: Building, color: 'text-text-primary' },
    { res: searchPack.events, icon: Video, color: 'text-warning' },
    { res: searchPack.courses, icon: BookOpen, color: 'text-info' }
  ];

  return (
    <div className="space-y-4">
      {/* Category View Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
            Destination Category
          </label>
          <span className="text-[11px] text-text-muted font-mono">
            6 Specialized LinkedIn Destinations
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as SearchCategory)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-accent-primary/10 border-accent-primary text-accent-primary shadow-glow-primary/20'
                    : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-4 h-4 mb-1.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WHY THIS SEARCH Explanation */}
      <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-accent-primary font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>WHY THIS SEARCH</span>
        </div>
        <p className="text-text-secondary leading-relaxed text-[11px]">
          {searchPack.explanation}
        </p>
      </div>

      {/* When All-in-One Pack is Active: Show All 6 Destination Cards */}
      {activeCategory === 'all' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-text-muted font-mono">
            <span>6 OPTIMIZED DESTINATIONS READY</span>
            <span>Direct Official Links</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {packItems.map(({ res, icon: Icon, color }) => (
              <div
                key={res.category}
                className="p-4 rounded-xl bg-surface border border-border hover:border-accent-primary/40 transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {res.label}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted uppercase">LinkedIn</span>
                  </div>
                  <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                  <p className="text-[10px] font-mono text-text-muted bg-surface-elevated p-1.5 rounded border border-border/50 truncate">
                    "{res.queryUsed}"
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs justify-between group hover:border-accent-primary hover:text-accent-primary"
                  onClick={() => onLaunchSearch(res)}
                >
                  <span>{res.actionText || `Open on LinkedIn`}</span>
                  <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-current transition-colors" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
