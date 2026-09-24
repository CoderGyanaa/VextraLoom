import { Sparkles, FileText, CheckCircle2, Mic, Map, Search, Bot, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'upcoming';
  icon: any;
  capabilities: string[];
}

export const AiToolsPage = () => {
  const tools: ToolItem[] = [
    {
      id: 'huntbuddy',
      name: 'HuntBuddy AI Companion',
      description: 'Your floating career guide that answers questions, directs you to roadmaps, and recommends tailored discovery criteria.',
      category: 'Assistant',
      status: 'active',
      icon: Sparkles,
      capabilities: ['Career pathway guidance', 'Instant roadmap links', 'Always available in bottom-right corner']
    },
    {
      id: 'resume_analyzer',
      name: 'Resume Analyzer',
      description: 'In-depth parsing of your resume draft with feedback on impact metrics, action verbs, and missing technical keywords.',
      category: 'Documents',
      status: 'upcoming',
      icon: FileText,
      capabilities: ['Bullet point impact scoring', 'Weak verb detection', 'Section structure checks']
    },
    {
      id: 'ats_checker',
      name: 'ATS Match Score Checker',
      description: 'Compares your resume against a target job description and highlights keyword gaps and formatting compatibility.',
      category: 'Compliance',
      status: 'upcoming',
      icon: CheckCircle2,
      capabilities: ['Job description keyword match', 'Formatting compatibility check', 'Tailoring suggestions']
    },
    {
      id: 'mock_interview',
      name: 'AI Mock Interview Simulator',
      description: 'Interactive voice and text technical interview simulation based on your target role and listed skills.',
      category: 'Interviews',
      status: 'upcoming',
      icon: Mic,
      capabilities: ['Role-specific technical questions', 'Real-time follow-up probes', 'Answer feedback & grading']
    },
    {
      id: 'roadmap_generator',
      name: 'Career Roadmap Generator',
      description: 'Generates a custom timeline and weekly learning syllabus tailored to your current year of study and target role.',
      category: 'Planning',
      status: 'upcoming',
      icon: Map,
      capabilities: ['Customized semester milestones', 'Time-to-hire estimation', 'Prerequisite dependency graphs']
    },
    {
      id: 'jd_analyzer',
      name: 'Job Description Deconstructer',
      description: 'Extracts true technical must-haves versus nice-to-haves from lengthy corporate job postings.',
      category: 'Intelligence',
      status: 'upcoming',
      icon: Search,
      capabilities: ['Must-have vs nice-to-have separation', 'Years of experience breakdown', 'Skill highlight pills']
    },
    {
      id: 'interview_coach',
      name: 'Behavioral Interview Coach',
      description: 'Interactive STAR method practice helper for tricky behavioral and HR questions.',
      category: 'Coaching',
      status: 'upcoming',
      icon: Bot,
      capabilities: ['STAR framework structure guidance', 'Clarity and conciseness evaluation', 'Sample winning answers']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-secondary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ACCELERATION SUITE • TRANSPARENT STATUS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Career AI Tools Hub
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
            AI utilities engineered specifically for student career acceleration. Unfinished services are honestly labeled as planned/upcoming.
          </p>
        </div>

        <Badge variant="outline" className="text-xs self-start">
          1 Active · 6 In Pipeline
        </Badge>
      </div>

      {/* Grid of Tools */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => {
          const Icon = tool.icon;
          const isActive = tool.status === 'active';

          return (
            <Card 
              key={tool.id} 
              className={`p-6 bg-surface-elevated/70 border-border transition-all flex flex-col justify-between ${
                isActive ? 'border-accent-secondary/50 shadow-glow-secondary/10' : 'hover:border-border/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                    isActive 
                      ? 'bg-accent-secondary/10 border-accent-secondary/30 text-accent-secondary' 
                      : 'bg-surface border-border text-text-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge 
                    variant={isActive ? 'success' : 'outline'} 
                    className="text-[10px] font-mono uppercase"
                  >
                    {isActive ? '● Active Assistant' : 'Planned / Upcoming'}
                  </Badge>
                </div>

                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block mb-1">
                  {tool.category}
                </span>
                <h3 className="text-base font-bold text-text-primary mb-2">
                  {tool.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {tool.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-border/40 mb-6">
                  {tool.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-text-muted">
                      <span className="w-1 h-1 rounded-full bg-accent-primary" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {isActive ? (
                  <Button 
                    size="sm" 
                    variant="primary" 
                    className="w-full text-xs gap-1.5"
                    onClick={() => {
                      const widgetBtn = document.querySelector('button[aria-label="Toggle HuntBuddy career companion"]') as HTMLButtonElement;
                      if (widgetBtn) widgetBtn.click();
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open HuntBuddy Companion</span>
                  </Button>
                ) : (
                  <div className="p-2.5 rounded-lg bg-surface border border-border/60 text-center flex items-center justify-center gap-1.5 text-xs text-text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Planned for Future Phase</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
