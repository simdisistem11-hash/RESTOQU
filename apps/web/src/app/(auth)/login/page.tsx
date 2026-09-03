'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Lock, Mail, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('cashier@bismillah.com');
  const [password, setPassword] = useState('cashier123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Server Error (${res.status})`);
        return;
      }

      const role = data.user.role;
      if (role === 'KITCHEN') {
        router.push('/kitchen');
      } else if (role === 'CASHIER') {
        router.push('/cashier');
      } else if (role === 'WAITER') {
        router.push('/waiter');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f5ef',
      color: '#1d2925',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#ffffff',
        borderRadius: 28,
        padding: 36,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 20,
            background: '#dff3e9', color: '#247d68',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14, boxShadow: '0 4px 14px rgba(36, 125, 104, 0.15)'
          }}>
            <ChefHat size={34} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.5 }}>RestoQu Portal</h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>Restaurant Operating System Multi-Tenant</p>
        </div>

        {error && (
          <div style={{
            padding: 12, borderRadius: 14, marginBottom: 18,
            background: '#fef2f2', border: '1px solid #fecaca',
            color: '#dc2626', fontSize: '0.85rem', fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4b5563' }}>Email Staf</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@restoran.com"
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 14,
                background: '#f9fafb', border: '1px solid #e5e7eb',
                fontSize: '0.95rem', color: '#1d2925', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4b5563' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 14,
                background: '#f9fafb', border: '1px solid #e5e7eb',
                fontSize: '0.95rem', color: '#1d2925', outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: 14, borderRadius: 16,
              background: '#247d68', color: '#ffffff', border: 'none',
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(36, 125, 104, 0.3)'
            }}
          >
            {loading ? 'Memproses Login...' : 'Masuk ke Portal Staf'}
          </button>
        </form>

        {/* Demo Quick Accounts */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>
            Demologin Cepat (Seed Account):
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setDemoAccount('cashier@bismillah.com', 'cashier123')}
              style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, borderRadius: 9999, border: 'none', background: '#dff3e9', color: '#247d68', cursor: 'pointer' }}
            >
              Kasir
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('kitchen@bismillah.com', 'kitchen123')}
              style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, borderRadius: 9999, border: 'none', background: '#fef3c7', color: '#d97706', cursor: 'pointer' }}
            >
              Dapur (KDS)
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('waiter@bismillah.com', 'waiter123')}
              style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, borderRadius: 9999, border: 'none', background: '#e0f2fe', color: '#0284c7', cursor: 'pointer' }}
            >
              Pelayan
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('owner@bismillah.com', 'owner123')}
              style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, borderRadius: 9999, border: 'none', background: '#f3e8ff', color: '#9333ea', cursor: 'pointer' }}
            >
              Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
