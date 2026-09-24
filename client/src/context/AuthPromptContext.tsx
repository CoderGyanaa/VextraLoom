import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, ArrowRight, Bookmark } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GoogleAuthButton } from '../components/GoogleAuthButton';

interface AuthPromptOptions {
  title?: string;
  description?: string;
  benefit?: string;
}

interface AuthPromptContextType {
  openAuthPrompt: (options?: AuthPromptOptions) => void;
  closeAuthPrompt: () => void;
}

const AuthPromptContext = createContext<AuthPromptContextType | undefined>(undefined);

export const AuthPromptProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AuthPromptOptions>({});
  const navigate = useNavigate();
  const location = useLocation();

  const openAuthPrompt = (opts?: AuthPromptOptions) => {
    setOptions(opts || {});
    setIsOpen(true);
  };

  const closeAuthPrompt = () => {
    setIsOpen(false);
  };

  const title = options.title || 'Create your free profile to save this';
  const description = options.description || 'Save opportunities, roadmaps, and resources in one place and access them from any device.';

  const handleNavigate = (path: string) => {
    closeAuthPrompt();
    navigate(path, { state: { from: location } });
  };

  return (
    <AuthPromptContext.Provider value={{ openAuthPrompt, closeAuthPrompt }}>
      {children}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={closeAuthPrompt}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="w-full max-w-md bg-surface-elevated border border-border rounded-2xl shadow-surface shadow-glow-secondary/10 p-6 relative overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient accent header line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary to-accent-secondary" />

            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                <Bookmark className="w-5 h-5" />
              </div>
              <button 
                onClick={closeAuthPrompt}
                className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-surface transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono font-medium text-accent-primary mb-2">
                <Sparkles className="w-3 h-3" />
                <span>PERSONALIZE WHEN READY</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-text-primary mb-2">
                {title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-center">
                <GoogleAuthButton />
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-surface-elevated px-2 text-text-muted uppercase tracking-wider font-semibold">Or</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full gap-2 justify-center"
                onClick={() => handleNavigate('/register')}
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => handleNavigate('/login')}
              >
                Log In with Email
              </Button>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-text-muted">Explore freely first</span>
              <button 
                onClick={closeAuthPrompt}
                className="text-text-secondary hover:text-accent-primary font-medium transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthPromptContext.Provider>
  );
};

export const useAuthPrompt = () => {
  const context = useContext(AuthPromptContext);
  if (!context) {
    throw new Error('useAuthPrompt must be used within an AuthPromptProvider');
  }
  return context;
};
