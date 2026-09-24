import { useEffect, useState, useRef } from 'react';
import { 
  Search, Compass, BookOpen, Target, LayoutDashboard, 
  Briefcase, Sparkles, Bookmark, User, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    const handleOpen = () => setIsOpen(true);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpen);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Automatically focus input on mount
      setTimeout(() => {
        const input = dialogRef.current?.querySelector('input');
        if (input) input.focus();
      }, 10);
    } else {
      document.body.style.overflow = '';
      setSearch(''); // clear search on close
      if (prevFocusRef.current) {
        prevFocusRef.current.focus();
      }
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleFocusTrap = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  if (!isOpen) return null;

  const actions = [
    { label: 'LinkedIn Search Optimizer', category: 'Discover', icon: Search, path: '/linkedin-search' },
    { label: 'Jobs & Openings', category: 'Discover', icon: Briefcase, path: '/jobs' },
    { label: 'Internships & Fellowships', category: 'Discover', icon: Compass, path: '/internships' },
    { label: 'Career Roadmaps & Skills', category: 'Learn', icon: BookOpen, path: '/roadmaps' },
    { label: 'Interview Preparation & DSA', category: 'Prepare', icon: Target, path: '/prepare' },
    { label: 'AI Tools & HuntBuddy Companion', category: 'AI Tools', icon: Sparkles, path: '/tools' },
    { label: 'Personal Dashboard', category: 'Personal', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Saved Searches & Opportunities', category: 'Personal', icon: Bookmark, path: '/saved' },
    { label: 'My Career Profile', category: 'Personal', icon: User, path: '/profile' }
  ];

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-background/80 backdrop-blur-md p-4 animate-fade-in" 
      onClick={() => setIsOpen(false)}
    >
      <div 
        ref={dialogRef}
        className="w-full max-w-xl bg-surface-elevated border border-border rounded-2xl shadow-surface shadow-glow-primary/10 overflow-hidden flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        onKeyDown={handleFocusTrap}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-accent-primary mr-3 shrink-0" aria-hidden="true" />
          <input 
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted"
            placeholder="Type a destination or search (e.g. Jobs, Roadmaps, LinkedIn, DSA)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search destinations"
          />
          <kbd className="hidden sm:inline-flex px-2 py-0.5 rounded bg-surface-elevated border border-border text-text-muted text-[10px] font-mono">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-text-muted font-mono tracking-wider uppercase" id="cp-results-heading">
            Quick Navigation ({filtered.length})
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              No matching destinations found for "{search}"
            </div>
          ) : (
            <div role="list" aria-labelledby="cp-results-heading">
              {filtered.map(action => {
                const Icon = action.icon;
                return (
                  <button 
                    key={action.path}
                    role="listitem"
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-text-secondary hover:text-text-primary hover:bg-surface transition-colors focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-primary group"
                    onClick={() => {
                      setIsOpen(false);
                      navigate(action.path);
                    }}
                  >
                    <div className="flex items-center min-w-0">
                      <Icon className="w-4 h-4 mr-3 text-accent-primary shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      <span className="font-medium truncate">{action.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-muted">
                        {action.category}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" aria-hidden="true" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-2.5 border-t border-border bg-surface flex items-center justify-between text-[11px] text-text-muted font-mono px-4">
          <span>Navigate with mouse or keyboard</span>
          <span><kbd className="px-1 rounded bg-surface-elevated border border-border">Ctrl</kbd> + <kbd className="px-1 rounded bg-surface-elevated border border-border">K</kbd></span>
        </div>
      </div>
    </div>
  );
};
