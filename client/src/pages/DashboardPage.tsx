

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {user?.name}</h2>
      <p>Role: {user?.role}</p>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none' }}>
        Logout
      </button>
    </div>
  );
};
