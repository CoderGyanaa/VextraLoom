const fs = require('fs');
const path = require('path');

const clientSrcDir = path.join(__dirname, 'client', 'src');

const ensureDir = (d) => {
  const dirPath = path.join(clientSrcDir, d);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

['pages', 'components'].forEach(ensureDir);

// Forgot Password Page
fs.writeFileSync(path.join(clientSrcDir, 'pages', 'ForgotPasswordPage.tsx'), `
import { useState } from 'react';
import api from '../services/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Forgot Password</h2>
      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none' }}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
};
`);

// Reset Password Page
fs.writeFileSync(path.join(clientSrcDir, 'pages', 'ResetPasswordPage.tsx'), `
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/reset-password', { token, password, confirmPassword });
      setMessage(res.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  if (!token) return <div>Invalid or missing token.</div>;

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Reset Password</h2>
      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="password" 
          placeholder="New Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
          Reset Password
        </button>
      </form>
    </div>
  );
};
`);

// Update Auth Context to support Google
const authContextPath = path.join(clientSrcDir, 'context', 'AuthContext.tsx');
let authContext = fs.readFileSync(authContextPath, 'utf8');
authContext = authContext.replace('login: (data: any) => Promise<void>;', 'login: (data: any) => Promise<void>;\n  googleLogin: (credential: string) => Promise<void>;');
authContext = authContext.replace('const login = async (data: any) => {', 
  "const googleLogin = async (credential: string) => {\\n" +
  "  const res = await api.post('/auth/google', { credential });\\n" +
  "  setAccessToken(res.data.data.accessToken);\\n" +
  "  setUser(res.data.data.user);\\n" +
  "};\\n\\n" +
  "const login = async (data: any) => {");
authContext = authContext.replace('login, register, logout', 'login, googleLogin, register, logout');
fs.writeFileSync(authContextPath, authContext);

// Google Sign In Component
fs.writeFileSync(path.join(clientSrcDir, 'components', 'GoogleAuthButton.tsx'), `
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const GoogleAuthButton = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  return (
    <div style={{ marginTop: '10px' }}>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (credentialResponse.credential) {
            try {
              await googleLogin(credentialResponse.credential);
              navigate(from, { replace: true });
            } catch (err: any) {
              setError(err.response?.data?.message || 'Google login failed');
            }
          }
        }}
        onError={() => {
          setError('Google Login Failed');
        }}
        useOneTap
      />
    </div>
  );
};
`);

// Update AppRoutes.tsx
fs.writeFileSync(path.join(clientSrcDir, 'routes', 'AppRoutes.tsx'), `
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
`);

// Replace App.tsx with GoogleOAuthProvider
fs.writeFileSync(path.join(clientSrcDir, 'App.tsx'), `
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id';

export const App = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AuthProvider>
          <div className="app-container">
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
`);

// Add Google button and Forgot password link to LoginPage
const loginPagePath = path.join(clientSrcDir, 'pages', 'LoginPage.tsx');
let loginPage = fs.readFileSync(loginPagePath, 'utf8');
loginPage = loginPage.replace("import { useAuth } from '../context/AuthContext';", "import { useAuth } from '../context/AuthContext';\\nimport { GoogleAuthButton } from '../components/GoogleAuthButton';\\nimport { Link } from 'react-router-dom';");
loginPage = loginPage.replace('</form>', 
  '</form>\\n' +
  '      <div style={{ marginTop: \\'15px\\', textAlign: \\'center\\' }}>\\n' +
  '        <Link to="/forgot-password">Forgot Password?</Link>\\n' +
  '      </div>\\n' +
  '      <div style={{ marginTop: \\'15px\\', display: \\'flex\\', justifyContent: \\'center\\' }}>\\n' +
  '        <GoogleAuthButton />\\n' +
  '      </div>');
fs.writeFileSync(loginPagePath, loginPage);

// Add Google button to RegisterPage
const regPagePath = path.join(clientSrcDir, 'pages', 'RegisterPage.tsx');
let regPage = fs.readFileSync(regPagePath, 'utf8');
regPage = regPage.replace("import { useAuth } from '../context/AuthContext';", "import { useAuth } from '../context/AuthContext';\\nimport { GoogleAuthButton } from '../components/GoogleAuthButton';");
regPage = regPage.replace('</form>', 
  '</form>\\n' +
  '      <div style={{ marginTop: \\'15px\\', display: \\'flex\\', justifyContent: \\'center\\' }}>\\n' +
  '        <GoogleAuthButton />\\n' +
  '      </div>');
fs.writeFileSync(regPagePath, regPage);

console.log("Scaffolded Client Extensions");
