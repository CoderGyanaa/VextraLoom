import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, Compass, BookOpen, Target, 
  Send, Layers, ShieldCheck, CheckCircle2,
  ExternalLink, TrendingUp, Cpu
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const popularSearches = [
    'Java Developer',
    'Software Engineer',
    'AI Internship',
    'Cybersecurity',
    'Data Analyst',
    'Cloud Engineer'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Guide student directly to Discover or LinkedIn Search with query
      navigate(`/linkedin-search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  const handlePopularSearch = (term: string) => {
    navigate(`/linkedin-search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-accent-primary/20 selection:text-white">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-16 border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 font-bold tracking-widest text-lg cursor-pointer group"
        >
          <div className="w-7 h-7 rounded bg-accent-primary flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform">
            <span className="text-background text-xs font-black">V</span>
          </div>
          <span className="text-text-primary uppercase tracking-widest text-base sm:text-lg">
            VEXTRALOOM
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-accent-primary hidden sm:inline">
            CAREER OS
          </span>
        </div>

        {/* Center Quick Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-secondary">
          <button onClick={() => navigate('/discover')} className="hover:text-text-primary transition-colors">
            Discover
          </button>
          <button onClick={() => navigate('/roadmaps')} className="hover:text-text-primary transition-colors">
            Roadmaps
          </button>
          <button onClick={() => navigate('/prepare')} className="hover:text-text-primary transition-colors">
            Preparation
          </button>
          <button onClick={() => navigate('/tools')} className="hover:text-text-primary transition-colors">
            AI Tools
          </button>
          <button onClick={() => navigate('/linkedin-search')} className="hover:text-accent-primary transition-colors flex items-center gap-1">
            <span>LinkedIn Search Hub</span>
            <span className="text-[10px] font-mono px-1 rounded bg-accent-primary/10 text-accent-primary">NEW</span>
          </button>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-xs gap-1.5"
            >
              <span>My Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent-primary" />
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                Sign In
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/register')}
                className="text-xs"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1">
        <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 px-6 overflow-hidden flex flex-col items-center text-center">
          {/* Subtle Ambient Light Gradients (Clean Obsidian with Neural Cyan glow) */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-primary/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium font-mono text-accent-primary mb-6 animate-fade-in shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary" />
            </span>
            <span>VEXTRALOOM CAREER OPERATING SYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mb-4 animate-slide-up leading-[1.1]">
            Your career, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-white to-accent-secondary">organized.</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mb-8 animate-slide-up leading-relaxed">
            Discover opportunities. Build skills. Prepare smarter. Find your next move — everything you need in one unified student operating system.
          </p>
          
          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-slide-up">
            <Button 
              size="lg" 
              className="gap-2 text-sm shadow-glow-primary/25"
              onClick={() => navigate('/discover')}
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 text-sm"
              onClick={() => navigate('/roadmaps')}
            >
              <span>Build My Career Path</span>
              <BookOpen className="w-4 h-4 text-accent-secondary" />
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="gap-2 text-sm text-text-secondary hover:text-accent-primary border border-border/60 hover:border-accent-primary/40 bg-surface/40"
              onClick={() => navigate('/linkedin-search')}
            >
              <span>LinkedIn Search Optimizer</span>
              <ExternalLink className="w-4 h-4 text-accent-primary" />
            </Button>
          </div>

          {/* 3. CAREER SEARCH CENTER (Integrated on Homepage) */}
          <div className="w-full max-w-2xl mx-auto p-2 sm:p-3 rounded-2xl bg-surface-elevated/80 border border-border shadow-surface backdrop-blur-md animate-slide-up">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-text-muted absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="What are you looking for? (e.g. Java developer jobs, AI internships, DSA roadmap)"
                className="w-full h-12 sm:h-14 pl-12 pr-28 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 h-9 px-4 text-xs font-semibold gap-1"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>

            {/* Popular Searches */}
            <div className="pt-3 px-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-text-muted font-mono text-[11px]">Popular:</span>
              {popularSearches.map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handlePopularSearch(term)}
                  className="px-2.5 py-1 rounded-md bg-surface border border-border/80 text-text-secondary hover:text-text-primary hover:border-accent-primary/40 transition-colors text-[11px]"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. CONNECTED CAREER JOURNEY PIPELINE */}
        <section className="py-20 px-6 max-w-6xl mx-auto border-t border-border/60">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-secondary mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>THE LIFECYCLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              The VEXTRALOOM Career Journey
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-lg mx-auto">
              A continuous, structured pathway designed to guide students from curiosity to career mastery.
            </p>
          </div>

          {/* Connected Flow Line */}
          <div className="relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-success -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              {[
                {
                  step: '01',
                  label: 'DISCOVER',
                  title: 'Explore Opportunities',
                  desc: 'Find verified jobs, internships, hackathons, and scholarships matched to your target stack.',
                  icon: Compass,
                  path: '/discover',
                  color: 'text-accent-primary border-accent-primary/40'
                },
                {
                  step: '02',
                  label: 'LEARN',
                  title: 'Master Roadmaps',
                  desc: 'Follow curated, milestone-based skill paths from fundamentals to production code.',
                  icon: BookOpen,
                  path: '/roadmaps',
                  color: 'text-accent-secondary border-accent-secondary/40'
                },
                {
                  step: '03',
                  label: 'PREPARE',
                  title: 'Sharpen Execution',
                  desc: 'Drill DSA patterns, Core CS subjects, Aptitude, System Design, and behavioral questions.',
                  icon: Target,
                  path: '/prepare',
                  color: 'text-warning border-warning/40'
                },
                {
                  step: '04',
                  label: 'APPLY',
                  title: 'Optimize Intent',
                  desc: 'Use the LinkedIn Search Optimizer to target recruiter inboxes and active hiring posts directly.',
                  icon: Send,
                  path: '/linkedin-search',
                  color: 'text-info border-info/40'
                },
                {
                  step: '05',
                  label: 'GROW',
                  title: 'Track Workspace',
                  desc: 'Bookmark opportunities, manage applications, and review skill-gap recommendations.',
                  icon: ShieldCheck,
                  path: '/dashboard',
                  color: 'text-success border-success/40'
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={idx} 
                    onClick={() => navigate(item.path)}
                    className="cursor-pointer group hover:border-border hover:-translate-y-1 transition-all bg-surface-elevated/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-5 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-xs text-text-muted">{item.step}</span>
                          <div className={`w-8 h-8 rounded-lg bg-surface border flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <span className="text-[10px] font-mono tracking-wider font-semibold text-text-muted uppercase block mb-1">
                          {item.label}
                        </span>
                        <h3 className="font-bold text-sm text-text-primary mb-1.5 group-hover:text-accent-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-border/40 flex items-center text-[11px] text-text-muted group-hover:text-text-primary transition-colors">
                        <span>Launch section</span>
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. CORE SYSTEM MODULES GRID */}
        <section className="py-20 px-6 max-w-6xl mx-auto border-t border-border/60">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1: LinkedIn Intent Optimizer */}
            <Card className="p-6 bg-surface-elevated/70 border-border hover:border-accent-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-mono mb-2">Public Utility</Badge>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  LinkedIn Optimized Search
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Turn your target degree, batch year, and skills into optimized natural-language and Precision Boolean queries directly for LinkedIn.
                </p>
                <ul className="space-y-1.5 text-xs text-text-secondary mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                    <span>Hiring Posts & Recruiter search modes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                    <span>Official LinkedIn URL filters (Date, Level, Mode)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                    <span>Zero scraping · Official LinkedIn tabs</span>
                  </li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs justify-between group"
                onClick={() => navigate('/linkedin-search')}
              >
                <span>Launch Optimizer</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Feature 2: Structured Roadmaps & Preparation */}
            <Card className="p-6 bg-surface-elevated/70 border-border hover:border-accent-secondary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center text-accent-secondary mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-mono mb-2">Curriculum</Badge>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Career Roadmaps & Prep
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Stop wandering between tutorials. Follow definitive technical roadmaps for Frontend, Backend, AI/ML, and Core CS engineering roles.
                </p>
                <ul className="space-y-1.5 text-xs text-text-secondary mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-secondary" />
                    <span>DSA patterns & high-yield problems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-secondary" />
                    <span>Core CS: OS, DBMS, Networks, System Design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-secondary" />
                    <span>Aptitude & behavioral interview question prep</span>
                  </li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs justify-between group"
                onClick={() => navigate('/roadmaps')}
              >
                <span>Explore Roadmaps</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Feature 3: AI Companion (HuntBuddy) */}
            <Card className="p-6 bg-surface-elevated/70 border-border hover:border-success/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-mono mb-2">Companion</Badge>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  HuntBuddy Companion & AI
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Your persistent career guide. Brainstorm target roles, explore roadmaps, and plan your interview prep with guided prompt flows.
                </p>
                <ul className="space-y-1.5 text-xs text-text-secondary mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span>Instant career guidance suggestions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span>Upcoming: Resume & ATS Score Analyzer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span>Always accessible floating companion</span>
                  </li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs justify-between group"
                onClick={() => navigate('/tools')}
              >
                <span>Discover AI Tools</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>
        </section>

        {/* 6. ETHICAL TRANSPARENCY & GUEST-FIRST COMMITMENT */}
        <section className="py-16 px-6 max-w-4xl mx-auto text-center border-t border-border/40">
          <div className="p-8 rounded-2xl bg-surface border border-border/80">
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Explore Freely. Personalize When Ready.
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto mb-6 leading-relaxed">
              VEXTRALOOM never locks public discovery behind a forced signup wall. 
              Browse all jobs, internships, roadmaps, and preparation resources anonymously. 
              Create an account only when you want to save opportunities and track your personal journey.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button 
                size="md" 
                variant="primary"
                onClick={() => navigate('/discover')}
              >
                Browse Public Opportunities
              </Button>
              <Button 
                size="md" 
                variant="outline"
                onClick={() => navigate('/register')}
              >
                Create Free Profile
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="py-8 px-6 lg:px-12 border-t border-border/60 bg-background text-xs text-text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-accent-primary/20 text-accent-primary flex items-center justify-center font-bold text-[10px]">
            V
          </div>
          <span>VEXTRALOOM &copy; {new Date().getFullYear()} — Career Operating System for Students</span>
        </div>
        <div className="flex items-center gap-4 text-text-secondary">
          <button onClick={() => navigate('/discover')} className="hover:text-text-primary">Discover</button>
          <button onClick={() => navigate('/roadmaps')} className="hover:text-text-primary">Roadmaps</button>
          <button onClick={() => navigate('/prepare')} className="hover:text-text-primary">Preparation</button>
          <button onClick={() => navigate('/linkedin-search')} className="hover:text-text-primary">LinkedIn Search</button>
        </div>
      </footer>
    </div>
  );
};
