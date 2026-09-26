import React from 'react';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { SavedSearchItem, SearchCriteria, SearchCategory } from '../../../services/search/types';
import { SearchStorage } from '../../../services/search/searchStorage';

interface LinkedInSavedSearchesProps {
  savedSearches: SavedSearchItem[];
  setSavedSearches: React.Dispatch<React.SetStateAction<SavedSearchItem[]>>;
  onLoadCriteria: (criteria: SearchCriteria, category: SearchCategory) => void;
  onNavigateToBuilder: () => void;
}

export const LinkedInSavedSearches: React.FC<LinkedInSavedSearchesProps> = ({
  savedSearches,
  setSavedSearches,
  onLoadCriteria,
  onNavigateToBuilder
}) => {
  const handleDelete = (id: string) => {
    SearchStorage.deleteSavedSearch(id);
    setSavedSearches(SearchStorage.getSavedSearches());
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Saved LinkedIn Searches</h2>
        <span className="text-xs text-text-muted font-mono">{savedSearches.length} Saved</span>
      </div>

      {savedSearches.length === 0 ? (
        <div className="py-16 text-center text-text-muted rounded-2xl bg-surface border border-border">
          <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30 text-accent-primary" />
          <h3 className="font-semibold text-text-primary mb-1">No Saved Searches Yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
            Build an optimized search and click "Save this search" to access it quickly anytime.
          </p>
          <Button size="sm" variant="outline" onClick={onNavigateToBuilder}>
            Back to Search Builder
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedSearches.map(item => (
            <Card key={item.id} className="hover:border-accent-primary/50 transition-all">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-text-primary line-clamp-1">{item.name}</h4>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">{item.category}</Badge>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <p>Role: <span className="text-text-primary font-medium">{item.criteria.role}</span></p>
                  <p>Location: <span className="text-text-primary font-medium">{item.criteria.location || 'Anywhere'}</span></p>
                  {item.criteria.skills?.length > 0 && (
                    <p className="truncate">
                      Skills: <span className="text-text-muted">{item.criteria.skills.join(', ')}</span>
                    </p>
                  )}
                  {item.criteria.education?.degree && (
                    <p>Degree: <span className="text-text-primary font-medium">{item.criteria.education.degree}</span></p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => onLoadCriteria(item.criteria, item.category)}
                    className="text-xs text-accent-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>Load Criteria</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-text-muted hover:text-error inline-flex items-center gap-1"
                    aria-label={`Delete saved search ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
