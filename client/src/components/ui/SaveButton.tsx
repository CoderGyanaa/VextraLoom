import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAuthPrompt } from '../../context/AuthPromptContext';
import { cn } from '../../lib/utils';

interface SaveButtonProps {
  itemTitle?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  itemTitle = 'this opportunity',
  className,
  size = 'md'
}) => {
  const { isAuthenticated } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      openAuthPrompt({
        title: `Create your free profile to save ${itemTitle}`,
        description: 'Keep opportunities, roadmaps, and resources in one place and access them from any device.'
      });
      return;
    }

    setIsSaved(!isSaved);
  };

  return (
    <button
      type="button"
      onClick={handleSaveClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border transition-all font-medium",
        size === 'sm' ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs",
        isSaved 
          ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary shadow-glow-primary/10" 
          : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border/80",
        className
      )}
      title={isSaved ? "Saved to your workspace" : "Save to my plan"}
      aria-label="Save opportunity"
    >
      <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-accent-primary")} />
      <span>{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
};
