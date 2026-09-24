import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-precision)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-amber)',
        marginBottom: '20px'
      }}>
        <AlertTriangle size={24} />
      </div>
      <h1 className="mono-metric" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
        404
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>
        The requested system route does not exist.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-surface-elevated)',
          color: 'var(--text-primary)',
          padding: '10px 20px',
          borderRadius: '8px',
          border: '1px solid var(--border-precision)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        <Home size={16} /> Return to Foundation Console
      </Link>
    </div>
  );
};
