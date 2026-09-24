
import { useEffect, useState } from 'react';
import { Search, Compass, BookOpen, Target, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { label: 'LinkedIn Optimized Search', icon: Search, path: '/linkedin-search' },
    { label: 'Discover Opportunities', icon: Compass, path: '/discover' },
    { label: 'View Career Roadmaps', icon: BookOpen, path: '/roadmaps' },
    { label: 'Interview Preparation', icon: Target, path: '/prepare' },
    { label: 'My Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-background/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-xl bg-surface-elevated border border-border rounded-xl shadow-surface overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-text-muted mr-3" />
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted"
            placeholder="Search VEXTRALOOM or type a command..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex px-2 py-0.5 rounded bg-surface border border-border text-text-muted text-xs font-mono">ESC</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          <div className="px-2 py-1.5 text-xs font-semibold text-text-muted font-mono tracking-wider">SUGGESTIONS</div>
          {actions.map(action => (
            <button 
              key={action.path}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors focus:bg-surface focus:outline-none"
              onClick={() => {
                setIsOpen(false);
                navigate(action.path);
              }}
            >
              <action.icon className="w-4 h-4 mr-3 text-accent-primary" />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
