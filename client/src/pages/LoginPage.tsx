import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary to-accent-secondary"></div>
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <p className="text-sm text-text-secondary mt-2">Sign in to your VEXTRALOOM account</p>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-4 text-sm text-error bg-error/10 border border-error/20 rounded-md">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email</label>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full mt-2">Sign In</Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <Link to="/forgot-password" className="text-accent-primary hover:underline transition-all">Forgot Password?</Link>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-elevated px-2 text-text-muted uppercase tracking-wider font-semibold">Or continue with</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <GoogleAuthButton />
          </div>
          
          <div className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account? <Link to="/register" className="text-text-primary font-medium hover:text-accent-primary transition-all">Register</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
