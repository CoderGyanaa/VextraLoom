
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <Input 
            placeholder="Search VEXTRALOOM... (Cmd + K)" 
            icon={<Search className="w-4 h-4" />}
            className="bg-surface border-border focus:ring-accent-primary/50 group-hover:border-border/80 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-text-secondary hover:text-text-primary">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-primary rounded-full animate-pulse-slow shadow-glow-primary"></span>
        </Button>
        <div className="h-8 w-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent-secondary transition-colors">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-text-primary">{user?.name?.charAt(0) || 'U'}</span>
          )}
        </div>
      </div>
    </header>
  );
};
