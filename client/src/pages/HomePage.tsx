import React, { useEffect, useState } from 'react';
import { checkHealth, HealthResponse } from '../services/api';
import { Terminal, Database, Server, Cpu, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reach API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '48px 24px' }}>
      {/* Header bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-precision)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Terminal size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em' }}>
              VEXTRALOOM<span style={{ color: 'var(--accent-cyan)' }}>_OS</span>
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Next-Gen Career Operating System Foundation
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-precision)',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: health?.status === 'success' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
            }} />
            MERN Foundation Active
          </span>
        </div>
      </header>

      {/* Hero Announcement */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--accent-cyan)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          Architecture & Foundation Initialized
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '12px'
        }}>
          VEXTRALOOM Workspace Ready
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          lineHeight: '1.6'
        }}>
          Clean, modular full-stack MERN architecture (React 18 + Vite + TypeScript, Node.js + Express + TypeScript, and MongoDB Atlas). Ready for Phase 1 verification and feature planning.
        </p>
      </section>

      {/* Grid: Foundation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {/* Frontend Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-precision)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Cpu size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Frontend Core</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Vite 6 SPA powered by React 18, React Router v6, and strict TypeScript.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>React 18</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>Vite 6</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>TypeScript</span>
          </div>
        </div>

        {/* Backend Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-precision)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Server size={20} color="var(--accent-indigo)" />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Backend Gateway</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Express API with TypeScript, CORS, environment management, and health routes.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>Node.js</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>Express</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>REST API</span>
          </div>
        </div>

        {/* Database Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-precision)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Database size={20} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Database Layer</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Prepared for MongoDB Atlas with Mongoose ODM and secure URI configuration.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>MongoDB Atlas</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>Mongoose</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>vextraloom db</span>
          </div>
        </div>
      </div>

      {/* Live Health Check Console Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-precision)',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Live API Health Status
            </span>
          </div>
          <button
            onClick={fetchHealth}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid var(--border-precision)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              color: 'var(--text-primary)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh Check
          </button>
        </div>

        {loading && (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px 0' }}>
            Pinging API health endpoint (/api/v1/health)...
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--accent-rose)',
            fontSize: '13px',
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
            padding: '12px',
            borderRadius: '6px'
          }}>
            <AlertCircle size={16} />
            <span>Connection check failed: {error} (Ensure backend server is running on port 5000)</span>
          </div>
        )}

        {health && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>API Status</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> {health.status.toUpperCase()}
                </span>
              </div>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Database (Atlas)</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: health.database === 'connected' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                }}>
                  {health.database.toUpperCase()}
                </span>
              </div>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Environment</span>
                <span className="mono-metric" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {health.environment}
                </span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-void)',
              borderRadius: '8px',
              padding: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              overflowX: 'auto'
            }}>
              <code>{JSON.stringify(health, null, 2)}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
