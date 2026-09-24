
import { NavLink } from 'react-router-dom';
import { Compass, BookOpen, Target, Sparkles, User, LayoutDashboard, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

const navGroups = [
  {
    label: "DISCOVER",
    items: [
      { name: 'Opportunities', icon: Compass, path: '/discover' }
    ]
  },
  {
    label: "LEARN & PREPARE",
    items: [
      { name: 'Roadmaps', icon: BookOpen, path: '/roadmaps' },
      { name: 'Preparation', icon: Target, path: '/prepare' }
    ]
  },
  {
    label: "AI TOOLS",
    items: [
      { name: 'HuntBuddy', icon: Sparkles, path: '/huntbuddy' }
    ]
  },
  {
    label: "PERSONAL",
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Saved', icon: Bookmark, path: '/saved' },
      { name: 'Profile', icon: User, path: '/profile' }
    ]
  }
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-border bg-background h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-widest text-text-primary uppercase flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent-primary flex items-center justify-center shadow-glow-primary">
            <span className="text-background text-xs font-black">V</span>
          </div>
          VEXTRALOOM
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-6 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map(item => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all relative overflow-hidden",
                      isActive 
                        ? "text-accent-primary bg-accent-primary/5 border-r-2 border-accent-primary" 
                        : "text-text-secondary hover:text-text-primary hover:bg-surface"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};
