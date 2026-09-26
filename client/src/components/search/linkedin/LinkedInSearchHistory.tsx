import React from 'react';
import { Clock, RefreshCw, ExternalLink, Trash2 } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { SearchHistoryItem, SearchCriteria, SearchCategory, OptimizedSearchResult } from '../../../services/search/types';
import { SearchStorage } from '../../../services/search/searchStorage';
import { LinkedInSearchAdapter } from '../../../services/search/linkedinAdapter';

interface LinkedInSearchHistoryProps {
  historyItems: SearchHistoryItem[];
  setHistoryItems: React.Dispatch<React.SetStateAction<SearchHistoryItem[]>>;
  onLoadCriteria: (criteria: SearchCriteria, category: SearchCategory) => void;
  onLaunchSearch: (result: OptimizedSearchResult) => void;
  onNavigateToBuilder: () => void;
}

export const LinkedInSearchHistory: React.FC<LinkedInSearchHistoryProps> = ({
  historyItems,
  setHistoryItems,
  onLoadCriteria,
  onLaunchSearch,
  onNavigateToBuilder
}) => {
  const handleClearHistory = () => {
    SearchStorage.clearHistory();
    setHistoryItems([]);
  };

  const handleSearchAgain = (item: SearchHistoryItem) => {
    const pack = LinkedInSearchAdapter.buildSearchPack(item.criteria);
    const res = item.category === 'jobs' ? pack.jobs :
      item.category === 'posts' ? pack.posts :
      item.category === 'people' ? pack.people :
      item.category === 'companies' ? pack.companies :
      item.category === 'events' ? pack.events : pack.courses;
    onLaunchSearch(res);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Recent LinkedIn Search History</h2>
        {historyItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-text-muted hover:text-error gap-1"
            onClick={handleClearHistory}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </Button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="py-16 text-center text-text-muted rounded-2xl bg-surface border border-border">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30 text-accent-secondary" />
          <h3 className="font-semibold text-text-primary mb-1">No Search History Yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
            Searches launched through VEXTRALOOM will appear here for fast re-execution.
          </p>
          <Button size="sm" variant="outline" onClick={onNavigateToBuilder}>
            Start Searching
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {historyItems.map(item => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">{item.category}</Badge>
                  <h4 className="text-sm font-semibold text-text-primary truncate">
                    {item.criteria.role} in {item.criteria.location || 'Anywhere'}
                  </h4>
                </div>
                <p className="text-xs text-accent-primary font-mono truncate mt-1">
                  "{item.generatedQuery}"
                </p>
                <span className="text-[10px] text-text-muted font-mono">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1"
                  onClick={() => onLoadCriteria(item.criteria, item.category)}
                >
                  <RefreshCw className="w-3 h-3" /> Load
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="text-xs gap-1"
                  onClick={() => handleSearchAgain(item)}
                >
                  <span>Search Again</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
