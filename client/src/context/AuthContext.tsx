
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { setAccessToken } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.post('/auth/refresh');
        setAccessToken(res.data.data.accessToken);
        const meRes = await api.get('/auth/me');
        setUser(meRes.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (data: any) => {
    const res = await api.post('/auth/login', data);
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setAccessToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
