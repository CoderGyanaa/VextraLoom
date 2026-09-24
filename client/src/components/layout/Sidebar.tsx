import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Search, BookOpen, Target, Sparkles, User, LayoutDashboard, Bookmark, ArrowRight, LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface NavItem {
  name: string;
  icon: LucideIcon;
  path: string;
  requiresAuth?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "DISCOVER (PUBLIC)",
    items: [
      { name: 'Opportunities', icon: Compass, path: '/discover' },
      { name: 'LinkedIn Optimizer', icon: Search, path: '/linkedin-search' }
    ]
  },
  {
    label: "LEARN (PUBLIC)",
    items: [
      { name: 'Career Roadmaps', icon: BookOpen, path: '/roadmaps' }
    ]
  },
  {
    label: "PREPARE (PUBLIC)",
    items: [
      { name: 'Interview Prep & DSA', icon: Target, path: '/prepare' }
    ]
  },
  {
    label: "AI TOOLS (PUBLIC)",
    items: [
      { name: 'AI Tool Hub', icon: Sparkles, path: '/tools' }
    ]
  },
  {
    label: "PERSONAL WORKSPACE",
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', requiresAuth: true },
      { name: 'Saved Searches', icon: Bookmark, path: '/saved', requiresAuth: true },
      { name: 'Profile', icon: User, path: '/profile', requiresAuth: true }
    ]
  }
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar = ({ isMobileOpen, onCloseMobile }: SidebarProps = {}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <>
      {/* Brand Header */}
      <div className="p-6">
        <NavLink to="/" onClick={handleLinkClick} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded bg-accent-primary flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform">
            <span className="text-background text-xs font-black">V</span>
          </div>
          <span className="text-xl font-bold tracking-widest text-text-primary uppercase">
            VEXTRALOOM
          </span>
        </NavLink>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-2">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-6 mb-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider font-mono">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map(item => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all relative overflow-hidden",
                      isActive 
                        ? "text-accent-primary bg-accent-primary/5 border-r-2 border-accent-primary" 
                        : "text-text-secondary hover:text-text-primary hover:bg-surface"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.requiresAuth && !isAuthenticated && (
                      <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-border text-text-muted">
                        LOCK
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Guest or User Bottom Card */}
      <div className="p-4 border-t border-border shrink-0">
        {!isAuthenticated ? (
          <div className="p-3.5 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-accent-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GUEST EXPLORER</span>
            </div>
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
              Explore freely. Sign in when ready to save opportunities and personalize your path.
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-xs justify-center gap-1.5"
              onClick={() => {
                handleLinkClick();
                navigate('/login', { state: { from: location } });
              }}
            >
              Sign In <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-bold text-xs text-accent-primary shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{user?.name}</p>
              <p className="text-[10px] text-text-muted truncate capitalize">{user?.role} Workspace</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border bg-background h-screen flex-col hidden md:flex sticky top-0 shrink-0">
        {navContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85%] h-full bg-background border-r border-border shadow-2xl flex flex-col animate-slide-right">
            <button 
              onClick={onCloseMobile}
              className="absolute top-6 right-4 p-2 rounded-lg bg-surface hover:bg-surface-elevated text-text-muted hover:text-text-primary z-10 transition-colors"
              aria-label="Close navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
