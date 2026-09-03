'use client';

import React, { useState } from 'react';
import { Shield, Building2, Plus, ArrowLeft, Search, CheckCircle2, AlertTriangle, Layers, Utensils, TrendingUp, Package, Settings } from 'lucide-react';
import Link from 'next/link';

interface TenantItem {
  id: string;
  name: string;
  slug: string;
  plan: 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  outletsCount: number;
  monthlyRevenue: number;
  createdAt: string;
}

export default function SaaSAdminDashboard() {
  const [tenants, setTenants] = useState<TenantItem[]>([
    { id: 't1', name: 'Bismillah Resto', slug: 'bismillah-resto', plan: 'PROFESSIONAL', status: 'ACTIVE', outletsCount: 3, monthlyRevenue: 12500000, createdAt: '10 Jan 2026' },
    { id: 't2', name: 'Kopi Senja Utama', slug: 'kopi-senja', plan: 'BUSINESS', status: 'ACTIVE', outletsCount: 5, monthlyRevenue: 24800000, createdAt: '15 Feb 2026' },
    { id: 't3', name: 'Ayam Bakar Nusantara', slug: 'ayam-bakar-nusantara', plan: 'STARTER', status: 'TRIAL', outletsCount: 1, monthlyRevenue: 4200000, createdAt: '20 Aug 2026' },
    { id: 't4', name: 'Fastfood Crunch Box', slug: 'crunch-box', plan: 'STARTER', status: 'SUSPENDED', outletsCount: 1, monthlyRevenue: 0, createdAt: '01 Mar 2026' }
  ]);

  const [search, setSearch] = useState('');

  const toggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const totalMRR = tenants.filter(t => t.status === 'ACTIVE').reduce((sum, t) => sum + (t.plan === 'BUSINESS' ? 999000 : t.plan === 'PROFESSIONAL' ? 499000 : 199000), 0);

  const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#f8f5ef',
      color: '#1d2925',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
      boxShadow: '0 0 40px rgba(0,0,0,0.1)',
      paddingBottom: 90
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 20px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#f8f5ef',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#9333ea', fontWeight: 700 }}>SUPER ADMIN PLATFORM</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>RestoQu SaaS Portal</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        {/* SaaS Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 22, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600 }}>Total Tenant Restoran</p>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d2925', marginTop: 2 }}>{tenants.length} Tenant</h2>
            <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, marginTop: 4, display: 'block' }}>● {tenants.filter(t => t.status === 'ACTIVE').length} Aktif</span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 22, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600 }}>Estimasi MRR</p>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#247d68', marginTop: 2 }}>Rp{(totalMRR / 1000).toFixed(0)}k/bln</h2>
            <span style={{ fontSize: '0.7rem', color: '#247d68', fontWeight: 700, marginTop: 4, display: 'block' }}>Monthly Recurring</span>
          </div>
        </div>

        {/* Search Tenant */}
        <div style={{ marginBottom: 16, background: '#ffffff', borderRadius: 16, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <Search size={18} style={{ color: '#9ca3af' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari tenant restoran..."
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', color: '#1d2925' }}
          />
        </div>

        {/* Tenant List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredTenants.map(tenant => (
            <div key={tenant.id} style={{ background: '#ffffff', borderRadius: 22, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800 }}>{tenant.name}</h3>
                <span style={{
                  padding: '3px 10px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700,
                  background: tenant.status === 'ACTIVE' ? '#dcfce7' : tenant.status === 'TRIAL' ? '#fef3c7' : '#fef2f2',
                  color: tenant.status === 'ACTIVE' ? '#166534' : tenant.status === 'TRIAL' ? '#92400e' : '#dc2626'
                }}>
                  {tenant.status}
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 12 }}>
                Slug: /{tenant.slug} • Plan: <strong style={{ color: '#247d68' }}>{tenant.plan}</strong> • {tenant.outletsCount} Outlet
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: 10 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1d2925' }}>
                  Omzet: Rp{tenant.monthlyRevenue.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => toggleTenantStatus(tenant.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                    background: tenant.status === 'ACTIVE' ? '#fef2f2' : '#dcfce7',
                    color: tenant.status === 'ACTIVE' ? '#dc2626' : '#166534'
                  }}
                >
                  {tenant.status === 'ACTIVE' ? 'Suspend Tenant' : 'Aktifkan Tenant'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FIXED OWNER BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '8px 12px 14px', zIndex: 90, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
      }}>
        <Link href="/dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <Layers size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Home</span>
        </Link>
        <Link href="/menu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <Utensils size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Menu</span>
        </Link>
        <Link href="/reports" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <TrendingUp size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Laporan</span>
        </Link>
        <Link href="/inventory" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <Package size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Stok</span>
        </Link>
        <Link href="/settings" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <Settings size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Setting</span>
        </Link>
      </nav>
    </div>
  );
}
