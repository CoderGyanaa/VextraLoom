import { useState } from 'react';
import { Compass, Filter, Search, ExternalLink } from 'lucide-react';
import { OpportunityCard } from '../components/ui/OpportunityCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DiscoverPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'internships', label: 'Internships' },
    { id: 'hackathons', label: 'Hackathons' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'opensource', label: 'Open Source' },
    { id: 'challenges', label: 'Challenges' }
  ];

  const opportunities = [
    {
      id: 'opp_1',
      category: 'jobs',
      title: "Junior Backend Developer",
      company: "Nexus Labs",
      location: "Bengaluru, India",
      salary: "₹6–9 LPA",
      workMode: "Hybrid" as const,
      deadline: "Apply soon",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
      matchScore: 92,
      matchReasons: [
        "Core proficiency in Java and relational database design",
        "Preferred location match (Bengaluru)"
      ],
      skillGaps: ["Familiarity with Kafka stream processing"],
      applyUrl: "https://www.linkedin.com/jobs"
    },
    {
      id: 'opp_2',
      category: 'internships',
      title: "Frontend Engineering Intern",
      company: "Vortex Systems",
      location: "Remote",
      salary: "₹25,000–35,000/month",
      workMode: "Remote" as const,
      deadline: "Open rolling",
      skills: ["React", "TypeScript", "Tailwind CSS", "Git"],
      matchScore: 88,
      matchReasons: [
        "Matches your modern React frontend focus",
        "Remote work preference matched"
      ],
      skillGaps: ["Testing with Playwright / Vitest"],
      applyUrl: "https://www.linkedin.com/jobs"
    },
    {
      id: 'opp_3',
      category: 'jobs',
      title: "Cloud & DevOps Graduate Trainee",
      company: "Aether Cloud",
      location: "Hyderabad, India",
      salary: "₹7–10 LPA",
      workMode: "On-site" as const,
      deadline: "Campus batch 2026",
      skills: ["Linux", "AWS / GCP", "Python", "CI/CD"],
      matchScore: 80,
      matchReasons: [
        "Aligns with core CS operating systems fundamentals",
        "Fresh graduate intake for 2026 batch"
      ],
      skillGaps: ["Terraform infrastructure as code basics"],
      applyUrl: "https://www.linkedin.com/jobs"
    },
    {
      id: 'opp_4',
      category: 'hackathons',
      title: "Global Student Hackathon 2026",
      company: "TechNexus Community",
      location: "Virtual / Global",
      salary: "₹5,00,000 Prize Pool",
      workMode: "Remote" as const,
      deadline: "Registrations open",
      skills: ["Web3", "AI/ML", "Cloud Architecture", "Full Stack"],
      matchReasons: ["Open to all engineering undergraduates worldwide"],
      skillGaps: [],
      applyUrl: "https://github.com"
    },
    {
      id: 'opp_5',
      category: 'scholarships',
      title: "Women in Engineering & Technology Fellowship",
      company: "Global STEM Foundation",
      location: "India / Remote",
      salary: "₹1,50,000 Grant",
      workMode: "Remote" as const,
      deadline: "Semester intake",
      skills: ["Academic Excellence", "Computer Science", "Community Impact"],
      matchReasons: ["Tuition support and 1:1 senior industry mentorship"],
      skillGaps: [],
      applyUrl: "https://www.linkedin.com"
    }
  ];

  const filtered = opportunities.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchTerm.trim() || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-primary mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>OPPORTUNITY DISCOVERY • PUBLIC ACCESS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Discover Opportunities
          </h1>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl leading-relaxed">
            {isAuthenticated 
              ? `Curated opportunities and verified listings matching your career profile.`
              : 'Browse verified student jobs, internships, hackathons, and scholarships freely. Save anything to your plan when ready.'
            }
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs gap-1.5 border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10"
            onClick={() => navigate('/linkedin-search')}
          >
            <span>LinkedIn Search Hub</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
          <Badge variant={isAuthenticated ? 'success' : 'outline'} className="text-xs">
            {isAuthenticated ? 'Personalized View' : 'Guest Explorer'}
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-surface border border-border space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-accent-primary text-background border-accent-primary font-bold shadow-glow-primary/20'
                  : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input inside discovery */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by title, skill (e.g. Java, React), or company..."
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-surface-elevated border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Opportunity List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-text-muted rounded-2xl bg-surface border border-border">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-30 text-accent-primary" />
            <h3 className="font-semibold text-sm text-text-primary mb-1">No matches found</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
              Try adjusting your search keywords, or use the LinkedIn Search Optimizer to discover fresh live postings.
            </p>
            <Button size="sm" variant="outline" onClick={() => navigate('/linkedin-search')}>
              Launch LinkedIn Search Hub
            </Button>
          </div>
        ) : (
          filtered.map(item => (
            <OpportunityCard key={item.id} {...item} />
          ))
        )}
      </div>
    </div>
  );
};
