
import { useNavigate } from 'react-router-dom';
import { Compass, BookOpen, Target, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Navbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 lg:px-12 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold tracking-widest text-lg">
          <div className="w-6 h-6 rounded bg-accent-primary flex items-center justify-center shadow-glow-primary">
            <span className="text-background text-xs font-black">V</span>
          </div>
          VEXTRALOOM
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
          <Button onClick={() => navigate('/register')}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-32 lg:py-48 px-6 overflow-hidden flex flex-col items-center text-center">
          {/* Subtle background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium font-mono text-accent-primary mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            VEXTRALOOM CAREER OS
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl mb-6 animate-slide-up leading-tight">
            Discover. Learn. Prepare. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Grow.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            What should I do next for my career? Find your next opportunity, build the skills you need, and prepare for your next interview.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Button size="lg" className="gap-2" onClick={() => navigate('/register')}>
              Launch Operating System <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Returning User
            </Button>
          </div>
        </section>

        {/* Value Props Section */}
        <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-border/50">
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <Card className="bg-surface/50 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-accent-primary" />
                </div>
                <CardTitle className="text-xl">Discover</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary">
                Find internships, jobs, and hackathons perfectly matched to your current skills and career trajectory.
              </CardContent>
            </Card>

            <Card className="bg-surface/50 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent-secondary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-accent-secondary" />
                </div>
                <CardTitle className="text-xl">Understand</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary">
                Follow structured career roadmaps to understand exactly what technologies and concepts you need to master.
              </CardContent>
            </Card>

            <Card className="bg-surface/50 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-xl">Prepare</CardTitle>
              </CardHeader>
              <CardContent className="text-text-secondary">
                Practice aptitude, data structures, and core computer science concepts before your technical interviews.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};
