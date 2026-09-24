
import { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

export const HuntBuddyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-surface-elevated border border-border rounded-2xl shadow-surface shadow-glow-secondary/20 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
          <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">HuntBuddy</h3>
                <p className="text-xs text-text-muted">Your Career Guide</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center justify-center text-center text-text-muted">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-3 shadow-glow-secondary/10">
              <Sparkles className="w-6 h-6 text-accent-secondary" />
            </div>
            <p className="text-sm max-w-[250px]">I'm HuntBuddy, your intelligent career assistant. AI integration coming soon!</p>
          </div>

          <div className="p-4 border-t border-border bg-surface">
            <div className="relative">
              <input 
                className="w-full bg-background border border-border rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-accent-secondary transition-colors"
                placeholder="Ask me anything..."
                disabled
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7 rounded-full text-accent-secondary opacity-50" disabled>
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <button 
        className={cn(
          "h-14 flex items-center gap-2 px-4 rounded-full bg-surface-elevated border border-border shadow-surface transition-all duration-300 hover:border-accent-secondary/50 hover:shadow-glow-secondary/30 group",
          isOpen ? "bg-accent-secondary text-white border-transparent" : "text-text-primary"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sparkles className={cn("w-5 h-5", isOpen ? "text-white" : "text-accent-secondary")} />
        <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-[200px] opacity-0 group-hover:opacity-100 group-hover:ml-2">
          HuntBuddy Guide
        </span>
      </button>
    </div>
  );
};
