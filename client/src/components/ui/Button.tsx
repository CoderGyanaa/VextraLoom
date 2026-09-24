
import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-accent-primary text-background hover:bg-accent-primary/90 shadow-[0_0_15px_-3px_rgba(0,229,255,0.4)]",
    secondary: "bg-surface-elevated text-text-primary hover:bg-border",
    outline: "border border-border bg-transparent hover:bg-surface-elevated text-text-primary",
    ghost: "bg-transparent hover:bg-surface-elevated text-text-primary",
    danger: "bg-error/10 text-error hover:bg-error/20"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';
