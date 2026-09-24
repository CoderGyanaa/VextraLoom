import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Target, Bookmark, Clock, ArrowRight, 
  ExternalLink, Sparkles, BookOpen, Compass
} from 'lucide-react';
import { SearchStorage } from '../services/search/searchStorage';
import { SavedSearchItem, SearchHistoryItem } from '../services/search/types';
import { GoogleAuthButton } from '../components/GoogleAuthButton';

export const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [completedPrepCount, setCompletedPrepCount] = useState<number>(0);

  useEffect(() => {
    setSavedSearches(SearchStorage.getSavedSearches());
    setHistoryItems(SearchStorage.getHistory());
    try {
      const prepSaved = localStorage.getItem('vextraloom_prep_completed_topics');
      if (prepSaved) {
        const parsed = JSON.parse(prepSaved);
        setCompletedPrepCount(Array.isArray(parsed) ? parsed.length : 0);
      }
    } catch {
      // fallback
    }
  }, []);

  // GUEST DASHBOARD EXPERIENCE
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <Card className="relative overflow-hidden border-border/80 shadow-surface bg-surface-elevated/90 backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
          
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mx-auto mb-4 shadow-glow-primary/20">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono font-medium text-accent-primary mb-3">
              <span>EXPLORE FREELY • PERSONALIZE WHEN READY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-2">
              Build Your Personal Career Workspace
            </h1>
            <p className="text-text-secondary text-sm max-w-lg mx-auto mb-8 leading-relaxed">
              VEXTRALOOM's core discovery tools are completely free to explore. Create an account to save opportunities, track your interview checklist, and personalize your journey.
            </p>

            {/* Benefits */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
              <div className="p-4 rounded-xl bg-surface border border-border">
                <Bookmark className="w-4 h-4 text-accent-primary mb-2" />
                <h4 className="font-semibold text-xs text-text-primary mb-1">Save Opportunities</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Keep jobs, internships, roadmaps, and custom LinkedIn searches in one place.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <Target className="w-4 h-4 text-warning mb-2" />
                <h4 className="font-semibold text-xs text-text-primary mb-1">Track Progress</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Check off DSA patterns, core CS subjects, and track preparation milestones.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <Sparkles className="w-4 h-4 text-accent-secondary mb-2" />
                <h4 className="font-semibold text-xs text-text-primary mb-1">Personal Matching</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Receive recommendations tailored to your graduation year, branch, and skills.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="max-w-sm mx-auto space-y-3">
              <div className="flex justify-center">
                <GoogleAuthButton />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => navigate('/register')}
                >
                  Create Free Account
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-text-muted hover:text-text-primary"
                onClick={() => navigate('/discover')}
              >
                Continue Exploring Opportunities as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // AUTHENTICATED USER DASHBOARD
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-primary mb-2">
            <span>CAREER OPERATING SYSTEM • PERSONAL WORKSPACE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Welcome back, {user.name}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Track your saved opportunities, preparation milestones, and active career roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {user.role} Workspace
          </Badge>
          <Button variant="outline" size="sm" onClick={logout} className="text-xs">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Overview Cards (Real data based on client state) */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Saved Searches */}
        <Card className="hover:border-accent-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
              Saved LinkedIn Searches
            </CardTitle>
            <Bookmark className="w-4 h-4 text-accent-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-text-primary">
              {savedSearches.length}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {savedSearches.length > 0 
                ? `${savedSearches.length} active search configuration(s)`
                : 'No saved searches yet'
              }
            </p>
          </CardContent>
        </Card>
        
        {/* Card 2: Interview Prep Completed Topics */}
        <Card className="hover:border-warning/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
              Preparation Milestones
            </CardTitle>
            <Target className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-warning">
              {completedPrepCount}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {completedPrepCount > 0 
                ? `${completedPrepCount} interview topics completed` 
                : 'Start tracking topics in the Prepare tab'
              }
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Recent Activity Sessions */}
        <Card className="hover:border-accent-secondary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
              Search Sessions
            </CardTitle>
            <Clock className="w-4 h-4 text-accent-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-text-primary">
              {historyItems.length}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {historyItems.length > 0 
                ? `${historyItems.length} recorded search actions` 
                : 'Searches will record automatically'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main 2-column workspace section */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Saved Searches & Recent History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Saved Searches Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-text-primary">
                Your Saved LinkedIn Searches
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-accent-primary"
                onClick={() => navigate('/linkedin-search')}
              >
                + New Search
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {savedSearches.length === 0 ? (
                <div className="py-8 text-center text-text-muted">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30 text-accent-primary" />
                  <p className="text-xs text-text-secondary">No saved searches yet.</p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Save searches in the LinkedIn Search Optimizer to access them here anytime.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 text-xs"
                    onClick={() => navigate('/linkedin-search')}
                  >
                    Open Search Optimizer
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedSearches.slice(0, 4).map(item => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between gap-3 hover:border-accent-primary/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-text-primary truncate">{item.name}</h4>
                        <p className="text-[10px] font-mono text-text-muted">
                          {item.criteria.role} · {item.criteria.location} · {item.criteria.datePosted}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs shrink-0 gap-1 hover:border-accent-primary"
                        onClick={() => navigate('/linkedin-search')}
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Search Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-text-primary">
                Recent Search History
              </CardTitle>
              <span className="text-xs font-mono text-text-muted">{historyItems.length} Sessions</span>
            </CardHeader>
            <CardContent className="p-4">
              {historyItems.length === 0 ? (
                <div className="py-8 text-center text-text-muted">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-30 text-accent-secondary" />
                  <p className="text-xs text-text-secondary">No search history yet.</p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Searches launched through VEXTRALOOM will appear here for fast re-execution.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {historyItems.slice(0, 4).map(item => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[9px] uppercase font-mono py-0">{item.category}</Badge>
                          <h4 className="text-xs font-medium text-text-primary truncate">
                            {item.criteria.role} in {item.criteria.location || 'Anywhere'}
                          </h4>
                        </div>
                        <p className="text-[11px] font-mono text-accent-primary truncate mt-0.5">
                          "{item.generatedQuery}"
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs text-text-muted hover:text-accent-primary shrink-0"
                        onClick={() => navigate('/linkedin-search')}
                      >
                        Re-open
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recommended Next Steps & Roadmap Shortcuts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-accent-primary/30 bg-surface-elevated">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-primary" />
                Recommended Next Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div 
                onClick={() => navigate('/linkedin-search')}
                className="p-3 rounded-xl bg-surface border border-border hover:border-accent-primary/50 cursor-pointer transition-all flex items-start gap-3 group"
              >
                <div className="w-7 h-7 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                    Build a LinkedIn Search Pack
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                    Target jobs, hiring posts, and recruiters posted in the last 24 hours.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => navigate('/roadmaps')}
                className="p-3 rounded-xl bg-surface border border-border hover:border-accent-secondary/50 cursor-pointer transition-all flex items-start gap-3 group"
              >
                <div className="w-7 h-7 rounded-lg bg-accent-secondary/10 flex items-center justify-center text-accent-secondary shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-text-primary group-hover:text-accent-secondary transition-colors">
                    Review Backend or Frontend Roadmap
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                    Identify your next technical skill milestones and database concepts.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => navigate('/prepare')}
                className="p-3 rounded-xl bg-surface border border-border hover:border-warning/50 cursor-pointer transition-all flex items-start gap-3 group"
              >
                <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0 mt-0.5">
                  <Target className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-text-primary group-hover:text-warning transition-colors">
                    Check off DSA Pattern Milestones
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                    Two pointers, sliding window, and tree traversals for interview prep.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Hub Navigation */}
          <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between text-xs">
            <div>
              <h4 className="font-semibold text-text-primary">Need instant career guidance?</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">HuntBuddy is always available.</p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs gap-1"
              onClick={() => {
                const widgetBtn = document.querySelector('button[aria-label="Toggle HuntBuddy career companion"]') as HTMLButtonElement;
                if (widgetBtn) widgetBtn.click();
              }}
            >
              <span>Ask HuntBuddy</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
