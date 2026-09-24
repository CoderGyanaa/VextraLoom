import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Bookmark, Sparkles, Compass, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { GoogleAuthButton } from './GoogleAuthButton';

interface AuthPromptViewProps {
  title?: string;
  subtitle?: string;
}

export const AuthPromptView: React.FC<AuthPromptViewProps> = ({
  title = "Unlock Your Personal Career Workspace",
  subtitle = "Sign in or create a free profile to access this section and personalize your journey."
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path, { state: { from: location } });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
      <Card className="relative overflow-hidden border-border/80 shadow-surface bg-surface-elevated/90 backdrop-blur-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
        
        <CardContent className="p-8 sm:p-12">
          {/* Header Badge */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-4 shadow-glow-primary/20">
              <Lock className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono font-medium text-accent-primary mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPLORE FREELY • PERSONALIZE WHEN READY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-2">
              {title}
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-lg leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-surface border border-border">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-3">
                <Bookmark className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Save & Track</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Bookmark jobs, internships, roadmaps, and return to them anytime across any device.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border">
              <div className="w-8 h-8 rounded-lg bg-accent-secondary/10 flex items-center justify-center text-accent-secondary mb-3">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Personal Matching</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Receive opportunities and skill-gap recommendations matched to your background.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Saved Progress</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Persist interview practice scores, roadmap milestones, and HuntBuddy AI history.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-center">
              <GoogleAuthButton />
            </div>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface-elevated px-3 text-text-muted uppercase tracking-wider font-semibold">Or</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="primary" 
                className="w-full gap-2 justify-center"
                onClick={() => handleNavigate('/register')}
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => handleNavigate('/login')}
              >
                Sign In
              </Button>
            </div>

            <div className="text-center pt-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-text-muted hover:text-text-primary gap-1.5"
                onClick={() => navigate('/discover')}
              >
                <Compass className="w-3.5 h-3.5" />
                Continue Exploring Opportunities as Guest
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
