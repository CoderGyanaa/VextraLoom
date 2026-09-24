import { useState } from 'react';
import { Sparkles, X, Send, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'huntbuddy';
  text: string;
  actionUrl?: string;
  actionLabel?: string;
}

export const HuntBuddyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const navigate = useNavigate();

  const suggestedPrompts = [
    { text: "Help me choose a career path", action: "/roadmaps", label: "Explore Roadmaps" },
    { text: "Find jobs for my skills", action: "/discover", label: "Browse Opportunities" },
    { text: "Create an interview plan", action: "/prepare", label: "Interview Preparation" },
    { text: "What should I learn next?", action: "/roadmaps", label: "Skills Curriculum" }
  ];

  const handleSelectPrompt = (prompt: typeof suggestedPrompts[0]) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt.text
    };

    let replyText = "";
    if (prompt.text.includes("career path")) {
      replyText = "To pick the right path, start with structured milestones based on what excites you: Frontend, Backend, AI/ML, or DevOps. Check out our curated career roadmaps to see standard industry expectations.";
    } else if (prompt.text.includes("Find jobs")) {
      replyText = "You can search public student jobs and internships directly in our Discover hub, or use our LinkedIn Search Optimizer to target hiring posts posted in the last 24 hours.";
    } else if (prompt.text.includes("interview plan")) {
      replyText = "A strong interview plan balances DSA pattern practice with Core CS fundamentals (OS, DBMS, Networks) and behavioral answers. Visit our Preparation section to follow a weekly checklist.";
    } else {
      replyText = "Identify the high-yield tools for your target role. For example, if you are learning Backend, master SQL, APIs, and containerization with Docker.";
    }

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'huntbuddy',
      text: replyText,
      actionUrl: prompt.action,
      actionLabel: prompt.label
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim()
    };

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'huntbuddy',
      text: `I'm currently in UI preview mode. For now, you can explore "${inputText.trim()}" in our Discover and Roadmaps sections! Full AI agent integration is coming in upcoming phases.`,
      actionUrl: '/discover',
      actionLabel: 'Explore Opportunities'
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[420px] h-[520px] max-h-[82vh] bg-surface-elevated border border-border rounded-2xl shadow-surface shadow-glow-secondary/20 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
          {/* Header */}
          <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent-secondary/10 border border-accent-secondary/30 flex items-center justify-center text-accent-secondary">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-text-primary">HuntBuddy</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                </div>
                <p className="text-[11px] text-text-muted">Your Career Companion (Preview UI)</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-elevated transition-colors"
              aria-label="Close HuntBuddy"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Message Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-text-muted py-6">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mb-3 shadow-glow-secondary/10 text-accent-secondary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-sm text-text-primary mb-1">
                  How can I help your career today?
                </h4>
                <p className="text-xs text-text-secondary max-w-[280px] mb-4 leading-relaxed">
                  I'm your persistent career companion. Select a prompt below or ask about roles, skills, and preparation.
                </p>

                {/* Suggested Prompts List */}
                <div className="w-full space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono text-text-muted uppercase block text-left mb-1">
                    Suggested Career Prompts:
                  </span>
                  {suggestedPrompts.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPrompt(p)}
                      className="w-full text-left p-2.5 rounded-xl bg-surface border border-border/80 hover:border-accent-secondary/50 text-xs text-text-secondary hover:text-text-primary transition-all flex items-center justify-between group"
                    >
                      <span className="truncate">{p.text}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-secondary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-accent-primary text-background font-medium rounded-tr-none'
                          : 'bg-surface border border-border text-text-primary rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.actionUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(msg.actionUrl!);
                        }}
                        className="mt-1.5 text-[11px] font-mono text-accent-secondary hover:underline flex items-center gap-1 self-start pl-1"
                      >
                        <span>→ {msg.actionLabel || 'View Section'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Prompts Bar if chat is active */}
          {messages.length > 0 && (
            <div className="px-3 py-1.5 bg-surface/50 border-t border-border/40 overflow-x-auto flex gap-1.5 shrink-0">
              {suggestedPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPrompt(p)}
                  className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] text-text-secondary whitespace-nowrap hover:text-accent-secondary hover:border-accent-secondary/40 transition-colors"
                >
                  {p.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 border-t border-border bg-surface">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input 
                className="w-full bg-background border border-border rounded-full pl-4 pr-10 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-secondary transition-colors"
                placeholder="Ask HuntBuddy anything about your career..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 h-7 w-7 rounded-full bg-accent-secondary/20 hover:bg-accent-secondary text-accent-secondary hover:text-white flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        className={cn(
          "h-12 flex items-center gap-2 px-4 rounded-full bg-surface-elevated border border-border shadow-surface transition-all duration-300 hover:border-accent-secondary/50 hover:shadow-glow-secondary/30 group",
          isOpen ? "bg-accent-secondary text-white border-transparent" : "text-text-primary"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle HuntBuddy career companion"
      >
        <Sparkles className={cn("w-4 h-4", isOpen ? "text-white" : "text-accent-secondary group-hover:rotate-12 transition-transform")} />
        <span className="font-medium text-xs whitespace-nowrap overflow-hidden transition-all duration-300 max-w-[120px]">
          HuntBuddy
        </span>
      </button>
    </div>
  );
};
