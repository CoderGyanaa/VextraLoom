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
