
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Target, Compass, BookOpen } from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-text-secondary mt-1">Here is your career overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">Profile 85% Complete</Badge>
          <Button variant="outline" size="sm" onClick={logout}>Sign Out</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted uppercase">Saved Opportunities</CardTitle>
            <Compass className="w-4 h-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">12</div>
            <p className="text-xs text-text-secondary mt-1">3 deadlines approaching</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted uppercase">Active Roadmaps</CardTitle>
            <BookOpen className="w-4 h-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">2</div>
            <p className="text-xs text-text-secondary mt-1">Frontend Developer, Data Structures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted uppercase">Prep Score</CardTitle>
            <Target className="w-4 h-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-accent-primary">740</div>
            <p className="text-xs text-text-secondary mt-1">+24 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-start p-3 rounded-lg bg-surface border border-border">
              <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0">
                <span className="text-accent-primary font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Update your Resume</h4>
                <p className="text-xs text-text-secondary mt-1">Use the Resume Analyzer AI to score your latest draft.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-3 rounded-lg bg-surface border border-border">
              <div className="w-8 h-8 rounded-full bg-accent-secondary/10 flex items-center justify-center shrink-0">
                <span className="text-accent-secondary font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Practice Arrays & Hashing</h4>
                <p className="text-xs text-text-secondary mt-1">You are 40% complete with this DSA module.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-text-muted">
              <Compass className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">No recent matches based on your profile.</p>
              <Button variant="ghost" className="mt-2 text-accent-primary">Browse All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
