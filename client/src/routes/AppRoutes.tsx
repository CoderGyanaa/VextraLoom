import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppShell } from '../components/layout/AppShell';

import { UniversalSearchPage } from '../pages/UniversalSearchPage';
import { DiscoverPage } from '../pages/DiscoverPage';
import { LinkedInSearchPage } from '../pages/LinkedInSearchPage';
import { LearnPage } from '../pages/LearnPage';
import { PreparePage } from '../pages/PreparePage';
import { AiToolsPage } from '../pages/AiToolsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Standalone Landing & Auth Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Global Application Shell: Open to both Guests & Authenticated Users */}
      <Route element={<AppShell />}>
        {/* PUBLIC DISCOVERY ROUTES */}
        <Route path="/search" element={<UniversalSearchPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/jobs" element={<DiscoverPage />} />
        <Route path="/internships" element={<DiscoverPage />} />
        <Route path="/hackathons" element={<DiscoverPage />} />
        <Route path="/scholarships" element={<DiscoverPage />} />
        <Route path="/linkedin-search" element={<LinkedInSearchPage />} />
        <Route path="/linkedin" element={<Navigate to="/linkedin-search" replace />} />

        {/* PUBLIC LEARN & CURRICULUM ROUTES */}
        <Route path="/learn" element={<Navigate to="/roadmaps" replace />} />
        <Route path="/roadmaps" element={<LearnPage />} />
        <Route path="/certifications" element={<LearnPage />} />

        {/* PUBLIC PREPARATION ROUTES */}
        <Route path="/prepare" element={<PreparePage />} />

        {/* PUBLIC AI TOOLS ROUTES */}
        <Route path="/tools" element={<AiToolsPage />} />
        <Route path="/huntbuddy" element={<AiToolsPage />} />

        {/* PROTECTED PERSONAL WORKSPACE (With Guest-Friendly Informative Prompts) */}
        <Route element={<ProtectedRoute title="Personal Career Dashboard" subtitle="Sign in to view your tailored opportunity matches, track applications, and measure your preparation progress." />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute title="Saved Opportunities & Searches" subtitle="Sign in to keep jobs, internships, roadmaps, and custom searches in one place across all your devices." />}>
          <Route path="/saved" element={<DashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute title="Career Profile" subtitle="Sign in to build your career profile, track your skills, and get personalized opportunity matching." />}>
          <Route path="/profile" element={
            <div className="max-w-4xl mx-auto space-y-4 py-8">
              <h1 className="text-3xl font-bold tracking-tight">Career Profile</h1>
              <p className="text-text-secondary text-sm">Manage your graduation year, degree, skills, and target career preferences.</p>
            </div>
          } />
        </Route>

        <Route element={<ProtectedRoute title="Preferences" subtitle="Sign in to customize your job preferences, target locations, and notification settings." />}>
          <Route path="/preferences" element={
            <div className="max-w-4xl mx-auto space-y-4 py-8">
              <h1 className="text-3xl font-bold tracking-tight">System Preferences</h1>
              <p className="text-text-secondary text-sm">Configure notifications, default search filters, and theme preferences.</p>
            </div>
          } />
        </Route>

        <Route element={<ProtectedRoute title="Notifications" subtitle="Sign in to receive instant alerts when matching opportunities and deadlines appear." />}>
          <Route path="/notifications" element={
            <div className="max-w-4xl mx-auto space-y-4 py-8">
              <h1 className="text-3xl font-bold tracking-tight">Notifications & Alerts</h1>
              <p className="text-text-secondary text-sm">Track opportunity deadlines and saved search alert updates.</p>
            </div>
          } />
        </Route>

        <Route element={<ProtectedRoute title="Activity History" subtitle="Sign in to review your past AI tool searches, analysis reports, and roadmap milestones." />}>
          <Route path="/history" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
