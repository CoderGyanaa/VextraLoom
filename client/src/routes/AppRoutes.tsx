
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

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected Routes enclosed in AppShell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/discover" element={<div className="p-4">Discover Page (Coming Soon)</div>} />
          <Route path="/roadmaps" element={<div className="p-4">Roadmaps Page (Coming Soon)</div>} />
          <Route path="/prepare" element={<div className="p-4">Prepare Page (Coming Soon)</div>} />
          <Route path="/huntbuddy" element={<div className="p-4">HuntBuddy AI Tools (Coming Soon)</div>} />
          <Route path="/saved" element={<div className="p-4">Saved Opportunities (Coming Soon)</div>} />
          <Route path="/profile" element={<div className="p-4">My Profile (Coming Soon)</div>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
