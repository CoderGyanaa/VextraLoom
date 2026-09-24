import { Compass, Filter } from 'lucide-react';
import { OpportunityCard } from '../components/ui/OpportunityCard';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const DiscoverPage = () => {
  const { isAuthenticated, user } = useAuth();

  const sampleOpportunities = [
    {
      title: "Junior Backend Developer",
      company: "Nexus Labs",
      location: "Bengaluru, India",
      salary: "₹6–9 LPA",
      workMode: "Hybrid" as const,
      deadline: "12 days left",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
      matchScore: 92,
      matchReasons: [
        "Strong alignment with Java core proficiency",
        "Preferred location match (Bengaluru)"
      ],
      skillGaps: ["Familiarity with Kafka stream processing"]
    },
    {
      title: "Frontend Engineering Intern",
      company: "Vortex Systems",
      location: "Remote",
      salary: "₹30,000/month",
      workMode: "Remote" as const,
      deadline: "5 days left",
      skills: ["React", "TypeScript", "Tailwind CSS", "Git"],
      matchScore: 88,
      matchReasons: [
        "Matches your modern React frontend focus",
        "Remote work preference matched"
      ],
      skillGaps: ["Next.js App Router experience"]
    },
    {
      title: "Cloud & DevOps Graduate Trainee",
      company: "Aether Cloud",
      location: "Hyderabad, India",
      salary: "₹7–10 LPA",
      workMode: "On-site" as const,
      deadline: "3 weeks left",
      skills: ["Linux", "AWS / GCP", "Python", "CI/CD"],
      matchScore: 79,
      matchReasons: [
        "Aligns with core CS fundamentals",
        "Fresh graduate intake for 2026 batch"
      ],
      skillGaps: ["Terraform infrastructure as code"]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-primary mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>PUBLIC CAREER DISCOVERY</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Explore Opportunities
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {isAuthenticated 
              ? `Personalized matches for ${user?.name} based on your career profile.`
              : 'Browse verified student jobs, internships, and hackathons freely. Save anything to your plan when ready.'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isAuthenticated ? 'success' : 'outline'} className="text-xs">
            {isAuthenticated ? 'Personalized View' : 'Guest Explorer Mode'}
          </Badge>
        </div>
      </div>

      {/* Filter Bar (Visual Foundation) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Filter className="w-4 h-4 text-text-muted" />
          <span className="font-semibold text-text-primary">Filter:</span>
          <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border cursor-pointer hover:border-accent-primary/50 text-text-primary">
            All Roles
          </span>
          <span className="px-2.5 py-1 rounded-md bg-transparent border border-transparent hover:border-border cursor-pointer">
            Internships
          </span>
          <span className="px-2.5 py-1 rounded-md bg-transparent border border-transparent hover:border-border cursor-pointer">
            Full-Time
          </span>
          <span className="px-2.5 py-1 rounded-md bg-transparent border border-transparent hover:border-border cursor-pointer">
            Remote
          </span>
        </div>

        <span className="text-xs font-mono text-text-muted">
          Showing 3 of 142 opportunities
        </span>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {sampleOpportunities.map((item, idx) => (
          <OpportunityCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};
