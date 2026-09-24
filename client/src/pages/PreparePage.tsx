import { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle, Code, Layers, FileText, Network, Brain } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface PrepModule {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: any;
  topics: { id: string; name: string; difficulty: 'Easy' | 'Medium' | 'Hard' }[];
}

export const PreparePage = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>('dsa');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vextraloom_prep_completed_topics');
      if (saved) setCompletedTopics(JSON.parse(saved));
    } catch {
      // fallback
    }
  }, []);

  const toggleTopic = (id: string) => {
    const updated = completedTopics.includes(id)
      ? completedTopics.filter(t => t !== id)
      : [...completedTopics, id];
    setCompletedTopics(updated);
    localStorage.setItem('vextraloom_prep_completed_topics', JSON.stringify(updated));
  };

  const modules: PrepModule[] = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      subtitle: 'Pattern-based coding interview curriculum',
      category: 'Coding',
      icon: Code,
      topics: [
        { id: 'dsa_1', name: 'Arrays & Two Pointers Pattern', difficulty: 'Easy' },
        { id: 'dsa_2', name: 'Sliding Window & Substring Problems', difficulty: 'Medium' },
        { id: 'dsa_3', name: 'Binary Search on Value Space', difficulty: 'Medium' },
        { id: 'dsa_4', name: 'Fast & Slow Pointers (Linked Lists)', difficulty: 'Easy' },
        { id: 'dsa_5', name: 'Monotonic Stack & Queue Patterns', difficulty: 'Medium' },
        { id: 'dsa_6', name: 'Tree Traversals (BFS, DFS, Inorder)', difficulty: 'Medium' },
        { id: 'dsa_7', name: 'Graph BFS/DFS & Topological Sort', difficulty: 'Hard' },
        { id: 'dsa_8', name: 'Dynamic Programming (1D & 2D Memoization)', difficulty: 'Hard' }
      ]
    },
    {
      id: 'core_cs',
      title: 'Core Computer Science',
      subtitle: 'OS, DBMS, Networks, and OOP concepts',
      category: 'CS Fundamentals',
      icon: Layers,
      topics: [
        { id: 'cs_1', name: 'OS: Processes vs Threads & IPC', difficulty: 'Medium' },
        { id: 'cs_2', name: 'OS: Virtual Memory & Page Replacement', difficulty: 'Medium' },
        { id: 'cs_3', name: 'DBMS: Normalization (1NF to BCNF)', difficulty: 'Easy' },
        { id: 'cs_4', name: 'DBMS: ACID Properties & Transactions', difficulty: 'Medium' },
        { id: 'cs_5', name: 'DBMS: Indexing Internals (B+ Trees)', difficulty: 'Hard' },
        { id: 'cs_6', name: 'Networks: TCP 3-Way Handshake vs UDP', difficulty: 'Medium' },
        { id: 'cs_7', name: 'Networks: DNS Resolution & HTTP/2', difficulty: 'Medium' },
        { id: 'cs_8', name: 'OOP: Polymorphism, Inheritance & SOLID Principles', difficulty: 'Easy' }
      ]
    },
    {
      id: 'system_design',
      title: 'System Design Basics',
      subtitle: 'High-level architectures and scalability',
      category: 'Architecture',
      icon: Network,
      topics: [
        { id: 'sd_1', name: 'Client-Server Architecture & Load Balancing', difficulty: 'Easy' },
        { id: 'sd_2', name: 'Database Sharding, Replication & Partitioning', difficulty: 'Medium' },
        { id: 'sd_3', name: 'Caching Strategies (Redis / Memcached)', difficulty: 'Medium' },
        { id: 'sd_4', name: 'Message Queues & Asynchronous Workflows', difficulty: 'Medium' },
        { id: 'sd_5', name: 'CAP Theorem & Distributed Consistency', difficulty: 'Hard' },
        { id: 'sd_6', name: 'Rate Limiting & Token Bucket Algorithm', difficulty: 'Medium' }
      ]
    },
    {
      id: 'aptitude',
      title: 'Aptitude & Logical Reasoning',
      subtitle: 'Quantitative aptitude for online campus assessments',
      category: 'Assessments',
      icon: Brain,
      topics: [
        { id: 'apt_1', name: 'Percentages, Profit & Loss', difficulty: 'Easy' },
        { id: 'apt_2', name: 'Time, Speed, Distance & Trains', difficulty: 'Medium' },
        { id: 'apt_3', name: 'Time & Work (Pipes & Cisterns)', difficulty: 'Medium' },
        { id: 'apt_4', name: 'Permutations & Combinations, Probability', difficulty: 'Hard' },
        { id: 'apt_5', name: 'Data Interpretation & Graphs', difficulty: 'Medium' },
        { id: 'apt_6', name: 'Logical Deduction & Syllogisms', difficulty: 'Easy' }
      ]
    },
    {
      id: 'resume',
      title: 'Resume & Communication',
      subtitle: 'ATS formatting and behavioral STAR answers',
      category: 'Career Readiness',
      icon: FileText,
      topics: [
        { id: 'res_1', name: 'Single-Page ATS Compliant Resume Structure', difficulty: 'Easy' },
        { id: 'res_2', name: 'Action Verbs & Impact Metrics (XYZ Formula)', difficulty: 'Medium' },
        { id: 'res_3', name: 'Technical Project Description Optimization', difficulty: 'Medium' },
        { id: 'res_4', name: 'Behavioral STAR Method (Situation, Task, Action, Result)', difficulty: 'Medium' },
        { id: 'res_5', name: 'Handling "Tell Me About Yourself" & Salary Questions', difficulty: 'Easy' }
      ]
    }
  ];

  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const moduleCompletedCount = currentModule.topics.filter(t => completedTopics.includes(t.id)).length;
  const modulePercentage = Math.round((moduleCompletedCount / currentModule.topics.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-warning mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>INTERVIEW PREPARATION • SELF-PACED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Interview & Skill Preparation
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
            High-yield coding patterns, Core CS principles, and behavioral guides. Check off concepts as you practice to track your interview readiness.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-text-muted block uppercase">Module Readiness</span>
            <span className="font-mono font-bold text-sm text-accent-primary">{moduleCompletedCount} / {currentModule.topics.length} Done</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-mono text-xs font-bold text-accent-primary">
            {modulePercentage}%
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {modules.map(mod => {
          const Icon = mod.icon;
          const isSelected = mod.id === activeModuleId;
          const completedInMod = mod.topics.filter(t => completedTopics.includes(t.id)).length;

          return (
            <button
              key={mod.id}
              onClick={() => setActiveModuleId(mod.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'bg-warning/10 border-warning text-text-primary shadow-glow-primary/10' 
                  : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-warning text-background' : 'bg-surface-elevated text-text-muted'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  {completedInMod}/{mod.topics.length}
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-text-primary">{mod.title}</h4>
            </button>
          );
        })}
      </div>

      {/* Topics Checklist Card */}
      <Card className="border-border/80 bg-surface-elevated/70">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{currentModule.title}</h2>
              <p className="text-xs text-text-secondary mt-1">{currentModule.subtitle}</p>
            </div>
            <span className="text-xs font-mono text-text-muted">Click any topic to mark as completed</span>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {currentModule.topics.map(topic => {
              const isChecked = completedTopics.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isChecked 
                      ? 'bg-success/5 border-success/30 text-text-primary' 
                      : 'bg-surface border-border/80 hover:border-border text-text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-text-muted shrink-0" />
                    )}
                    <span className={`text-xs font-medium leading-relaxed truncate ${isChecked ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                      {topic.name}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                    topic.difficulty === 'Easy' ? 'bg-success/10 text-success border-success/20' :
                    topic.difficulty === 'Medium' ? 'bg-warning/10 text-warning border-warning/20' :
                    'bg-error/10 text-error border-error/20'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Practice Action */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-text-muted">Need to test your knowledge on {currentModule.title}?</span>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1.5 text-xs text-accent-primary hover:border-accent-primary"
              onClick={() => window.location.href = '/linkedin-search'}
            >
              <span>Search {currentModule.title} Mock Questions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
