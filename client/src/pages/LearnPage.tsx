import { useState } from 'react';
import { BookOpen, Award, CheckCircle2, ChevronRight, Terminal, Globe, Cpu, Database, Shield } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface RoadmapPath {
  id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  icon: any;
  stages: { name: string; topics: string[] }[];
}

export const LearnPage = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>('backend');

  const roadmaps: RoadmapPath[] = [
    {
      id: 'backend',
      title: 'Backend Engineering',
      category: 'Core Engineering',
      level: 'Beginner to Advanced',
      description: 'Master server-side architecture, relational & NoSQL databases, RESTful & GraphQL APIs, and scalable distributed systems.',
      icon: Terminal,
      stages: [
        { name: '1. Fundamentals', topics: ['Data Structures & Algorithms', 'HTTP / HTTPS Protocols', 'Git & Version Control', 'Linux Terminal Basics'] },
        { name: '2. Language & Runtime', topics: ['Java / Spring Boot or Node.js / TypeScript', 'OOP & Design Patterns', 'Concurrency & Multithreading'] },
        { name: '3. Databases & Storage', topics: ['PostgreSQL / MySQL Schema Design', 'Indexing & Query Optimization', 'MongoDB / Redis Caching'] },
        { name: '4. Distributed Systems', topics: ['Docker Containerization', 'Message Queues (Kafka / RabbitMQ)', 'Microservices Architecture', 'CI/CD Pipelines'] }
      ]
    },
    {
      id: 'frontend',
      title: 'Modern Frontend Engineering',
      category: 'Web & UI',
      level: 'Beginner to Advanced',
      description: 'Build responsive, accessible, high-performance web applications using React, TypeScript, and modern state architectures.',
      icon: Globe,
      stages: [
        { name: '1. Web Foundations', topics: ['HTML5 Semantic Structure', 'Modern CSS & Flexbox/Grid', 'JavaScript ES6+ Deep Dive', 'DOM Manipulation'] },
        { name: '2. Modern Framework', topics: ['React Components & Hooks', 'TypeScript Typing & Interfaces', 'Tailwind CSS Utility Design'] },
        { name: '3. State & Networking', topics: ['TanStack Query / SWR Caching', 'Context API & Redux Toolkit', 'REST & GraphQL API Integration'] },
        { name: '4. Performance & Scale', topics: ['Web Vitals Optimization', 'Client-side Security & Auth', 'Testing with Vitest & Playwright'] }
      ]
    },
    {
      id: 'aiml',
      title: 'AI & Machine Learning',
      category: 'Data & Intelligence',
      level: 'Intermediate',
      description: 'From linear algebra and statistical modeling to deep learning architectures, LLMs, and production MLOps pipelines.',
      icon: Cpu,
      stages: [
        { name: '1. Math & Programming', topics: ['Linear Algebra & Calculus', 'Probability & Statistics', 'Python Programming', 'NumPy & Pandas'] },
        { name: '2. Classical ML', topics: ['Supervised & Unsupervised Learning', 'Scikit-Learn', 'Feature Engineering & Model Evaluation'] },
        { name: '3. Deep Learning & NLP', topics: ['PyTorch Foundations', 'CNNs & Vision Models', 'Transformers & Large Language Models'] },
        { name: '4. Deployment & MLOps', topics: ['Model Serving with FastAPI', 'Vector Databases & RAG Pipelines', 'MLflow Tracking'] }
      ]
    },
    {
      id: 'devops',
      title: 'Cloud & DevOps Engineering',
      category: 'Infrastructure',
      level: 'Intermediate',
      description: 'Automate build, deployment, container orchestration, and cloud infrastructure reliability.',
      icon: Database,
      stages: [
        { name: '1. Core Systems', topics: ['Linux Administration', 'Networking Basics (DNS, TCP/UDP)', 'Shell Scripting (Bash / Python)'] },
        { name: '2. Containers & Cloud', topics: ['Docker Containerization', 'AWS or Google Cloud Platform Essentials', 'Kubernetes Architecture'] },
        { name: '3. Infrastructure as Code', topics: ['Terraform Declarative Provisioning', 'GitHub Actions CI/CD', 'Ansible Configuration'] },
        { name: '4. Observability', topics: ['Prometheus & Grafana Monitoring', 'Log Management with ELK', 'Site Reliability Engineering Principles'] }
      ]
    },
    {
      id: 'security',
      title: 'Cybersecurity Fundamentals',
      category: 'Security',
      level: 'Beginner to Intermediate',
      description: 'Understand network security, penetration testing fundamentals, secure coding practices, and identity architectures.',
      icon: Shield,
      stages: [
        { name: '1. Network & OS', topics: ['OSI Model & Packet Analysis', 'Wireshark Fundamentals', 'Linux & Windows Security'] },
        { name: '2. Application Security', topics: ['OWASP Top 10 Vulnerabilities', 'Authentication & JWT Security', 'Input Validation & Sanitization'] },
        { name: '3. Defensive Security', topics: ['Firewalls & IDS/IPS', 'Cryptography Essentials', 'Incident Response Basics'] }
      ]
    }
  ];

  const currentRoadmap = roadmaps.find(r => r.id === selectedRoadmap) || roadmaps[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-secondary mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>LEARNING PATHWAYS • PUBLIC & FREE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Career Roadmaps & Skills
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
            Curated milestone-based engineering paths. Follow verified concepts from fundamental principles to production readiness.
          </p>
        </div>

        <Badge variant="outline" className="text-xs self-start">
          5 Core Pathways
        </Badge>
      </div>

      {/* Roadmap Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {roadmaps.map(rm => {
          const Icon = rm.icon;
          const isSelected = selectedRoadmap === rm.id;
          return (
            <button
              key={rm.id}
              onClick={() => setSelectedRoadmap(rm.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'bg-accent-secondary/10 border-accent-secondary text-text-primary shadow-glow-secondary/20' 
                  : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-accent-secondary text-white' : 'bg-surface-elevated text-text-muted'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />}
              </div>
              <div>
                <span className="text-[10px] font-mono text-text-muted uppercase block">{rm.category}</span>
                <h4 className="font-bold text-xs sm:text-sm text-text-primary mt-0.5">{rm.title}</h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Roadmap Detailed Milestone Flow */}
      <Card className="border-border/80 bg-surface-elevated/70">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-text-primary">{currentRoadmap.title}</h2>
                <Badge variant="outline" className="text-[10px]">{currentRoadmap.level}</Badge>
              </div>
              <p className="text-xs text-text-secondary mt-1 max-w-2xl">{currentRoadmap.description}</p>
            </div>
            <Button size="sm" variant="outline" className="self-start sm:self-auto text-xs gap-1.5">
              <Award className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Recommended Certifications</span>
            </Button>
          </div>

          {/* Stages Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Step-by-Step Curriculum
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {currentRoadmap.stages.map((stage, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-surface border border-border/80 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-secondary/20 text-accent-secondary flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </div>
                    <h4 className="font-semibold text-sm text-text-primary">{stage.name}</h4>
                  </div>
                  <ul className="space-y-1.5 pl-2 text-xs text-text-secondary">
                    {stage.topics.map((t, ti) => (
                      <li key={ti} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-secondary/60 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-text-muted">Explore opportunities matching this roadmap:</span>
            <Button 
              size="sm" 
              variant="primary" 
              className="gap-1.5 text-xs"
              onClick={() => window.location.href = `/discover?role=${encodeURIComponent(currentRoadmap.title)}`}
            >
              <span>View Related Jobs & Internships</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
