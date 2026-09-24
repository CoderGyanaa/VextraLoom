import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppShell } from '../components/layout/AppShell';

import { DiscoverPage } from '../pages/DiscoverPage';
import { LinkedInSearchPage } from '../pages/LinkedInSearchPage';

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
        {/* PUBLIC DISCOVERY & LEARNING ROUTES */}
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/linkedin-search" element={<LinkedInSearchPage />} />
        <Route path="/jobs" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-text-secondary">Browse verified student and early-career job openings.</p>
          </div>
        } />
        <Route path="/internships" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Internships</h1>
            <p className="text-text-secondary">Find summer, winter, and off-campus internships.</p>
          </div>
        } />
        <Route path="/hackathons" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Hackathons & Challenges</h1>
            <p className="text-text-secondary">Compete in upcoming student hackathons and open-source events.</p>
          </div>
        } />
        <Route path="/scholarships" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
            <p className="text-text-secondary">Explore higher education, merit, and tech diversity scholarships.</p>
          </div>
        } />
        <Route path="/roadmaps" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Career Roadmaps</h1>
            <p className="text-text-secondary">Curated, step-by-step career path roadmaps from beginner to industry ready.</p>
          </div>
        } />
        <Route path="/certifications" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Certifications & Credentials</h1>
            <p className="text-text-secondary">Industry certifications that matter for your target roles.</p>
          </div>
        } />
        <Route path="/prepare" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Interview & Skill Preparation</h1>
            <p className="text-text-secondary">DSA, Aptitude, System Design, and behavioral interview question guides.</p>
          </div>
        } />
        <Route path="/tools" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Career Tools</h1>
            <p className="text-text-secondary">Free career exploration utilities available to all students.</p>
          </div>
        } />
        <Route path="/huntbuddy" element={
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">HuntBuddy AI Assistant</h1>
            <p className="text-text-secondary">Interactive guidance and career recommendations.</p>
          </div>
        } />

        {/* PROTECTED PERSONAL ROUTES (With Guest-Friendly Informative Prompts) */}
        <Route element={<ProtectedRoute title="Personal Career Dashboard" subtitle="Sign in to view your tailored opportunity matches, track applications, and measure your preparation progress." />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute title="Saved Opportunities" subtitle="Sign in to keep jobs, internships, roadmaps, and preparation resources in one place across all your devices." />}>
          <Route path="/saved" element={
            <div className="max-w-5xl mx-auto space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
              <p className="text-text-secondary">Your bookmarked opportunities and roadmaps.</p>
            </div>
          } />
        </Route>

        <Route element={<ProtectedRoute title="Career Profile" subtitle="Sign in to build your career profile, track your skills, and get personalized opportunity matching." />}>
          <Route path="/profile" element={
            <div className="max-w-5xl mx-auto space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
              <p className="text-text-secondary">Your skills, education, and career aspirations.</p>
            </div>
          } />
        </Route>

        <Route element={<ProtectedRoute title="Preferences" subtitle="Sign in to customize your job preferences, target locations, and notification settings." />}>
          <Route path="/preferences" element={
            <div className="max-w-5xl mx-auto space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
              <p className="text-text-secondary">Configure your career operating system preferences.</p>
            </div>
          } />
        </Route>

        <Route element={<ProtectedRoute title="Notifications" subtitle="Sign in to receive instant alerts when matching opportunities and deadlines appear." />}>
          <Route path="/notifications" element={
            <div className="max-w-5xl mx-auto space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
              <p className="text-text-secondary">Opportunity alerts and deadline reminders.</p>
            </div>
          } />
        </Route>

        <Route element={<ProtectedRoute title="Activity History" subtitle="Sign in to review your past AI tool searches, analysis reports, and roadmap milestones." />}>
          <Route path="/history" element={
            <div className="max-w-5xl mx-auto space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Activity History</h1>
              <p className="text-text-secondary">Your past career actions and AI session logs.</p>
            </div>
          } />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
