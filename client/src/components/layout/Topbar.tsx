import { Search, Bell, Menu, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps = {}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path, { state: { from: location } });
  };

  const openSearch = () => {
    window.dispatchEvent(new Event('open-command-palette'));
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick} aria-label="Open mobile menu">
          <Menu className="w-5 h-5" />
        </Button>
        <div 
          className="hidden md:flex flex-1 max-w-md relative group cursor-pointer"
          onClick={openSearch}
        >
          <div className="absolute inset-0 z-10" aria-hidden="true" />
          <Input 
            placeholder="Search VEXTRALOOM... (Cmd + K)" 
            icon={<Search className="w-4 h-4" />}
            className="bg-surface border-border focus:ring-accent-primary/50 group-hover:border-border/80 transition-colors pointer-events-none"
            readOnly
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openSearch();
              }
            }}
            aria-label="Open command palette"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <>
            <Button variant="ghost" size="icon" className="relative text-text-secondary hover:text-text-primary" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-primary rounded-full animate-pulse-slow shadow-glow-primary"></span>
            </Button>
            
            <div 
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-surface border border-border cursor-pointer hover:border-accent-primary/50 transition-colors"
              onClick={() => navigate('/profile')}
            >
              <div className="h-7 w-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center overflow-hidden">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-accent-primary">{user.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <span className="text-xs font-medium text-text-primary hidden sm:inline">{user.name?.split(' ')[0]}</span>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-text-muted hover:text-error"
              onClick={logout}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-[11px] font-mono text-text-muted mr-1">
              <Sparkles className="w-3 h-3 text-accent-primary" />
              <span>GUEST EXPLORER</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-text-secondary hover:text-text-primary text-xs"
              onClick={() => handleNavigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="text-xs"
              onClick={() => handleNavigate('/register')}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
