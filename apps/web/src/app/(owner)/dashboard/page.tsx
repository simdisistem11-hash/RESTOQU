'use client';

import React, { useState } from 'react';
import {
  Layers, TrendingUp, ArrowUpRight, ArrowLeft, QrCode, Package, Settings,
  ChefHat, ShoppingBag, Gift, Users, Zap, ShieldCheck, Utensils, Sparkles, X, Grid
} from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboardMobilePage() {
  const [showQuickLauncher, setShowQuickLauncher] = useState(false);

  return (
    <div style={{
      width: '100%',
      maxWidth: 480,
      minHeight: '100vh',
      margin: '0 auto',
      background: '#f8f5ef',
      color: '#1d2925',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      boxShadow: '0 0 40px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Mobile Native Header */}
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
            <p style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 800 }}>ENTERPRISE OWNER DASHBOARD</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d2925', letterSpacing: -0.3 }}>Bismillah Resto</h1>
          </div>
        </div>

        <button
          onClick={() => setShowQuickLauncher(true)}
          style={{ padding: '6px 12px', borderRadius: 9999, background: '#247d68', color: '#ffffff', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 3px 10px rgba(36,125,104,0.3)' }}
        >
          <Zap size={14} /> Fitur
        </button>
      </header>

      {/* Owner Mobile Content */}
      <main style={{ flex: 1, padding: '0 20px 80px' }}>
        {/* Analytics Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, marginTop: 6 }}>
          <div style={{ background: '#ffffff', borderRadius: 22, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>OMSET HARI INI</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#247d68', marginTop: 2 }}>Rp3.450.000</h3>
            <span style={{ fontSize: '0.68rem', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: 9999, fontWeight: 800, marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <ArrowUpRight size={12} /> +14.2% vs kemarin
            </span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 22, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL ORDER</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d2925', marginTop: 2 }}>48 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Struk</span></h3>
            <span style={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: 700, marginTop: 6, display: 'block' }}>Rata-rata: Rp71.8k</span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 22, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>FOOD COST</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#247d68', marginTop: 2 }}>32.4%</h3>
            <span style={{ fontSize: '0.68rem', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: 9999, fontWeight: 800, marginTop: 6, display: 'inline-block' }}>
              ✓ Optimal (&lt;35%)
            </span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 22, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>STOCK WASTE</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#dc2626', marginTop: 2 }}>Rp45.000</h3>
            <span style={{ fontSize: '0.68rem', color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: 9999, fontWeight: 800, marginTop: 6, display: 'inline-block' }}>
              2 item waste
            </span>
          </div>
        </div>

        {/* Menu Terlaris Table */}
        <div style={{ background: '#ffffff', borderRadius: 24, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1d2925' }}>Top Menu Terlaris Hari Ini</h2>
            <Link href="/menu" style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 800, textDecoration: 'none' }}>
              Kelola Menu →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Nasi Goreng Spesial RestoQu', count: 24, total: 672000 },
              { name: 'Ayam Bakar Madura', count: 18, total: 576000 },
              { name: 'Kopi Gula Aren', count: 32, total: 576000 },
              { name: 'Es Teh Manis Jumbo', count: 45, total: 360000 }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: 14 }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1d2925' }}>{item.name}</span>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>Terjual {item.count} porsi</p>
                </div>
                <span style={{ fontWeight: 900, color: '#247d68', fontSize: '0.9rem' }}>
                  Rp{item.total.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FIXED OWNER BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '10px 12px calc(14px + env(safe-area-inset-bottom, 0px))', zIndex: 99999, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)'
      }}>
        <Link href="/dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#247d68', padding: '4px 0' }}>
          <Layers size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>Home</span>
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

        <button
          onClick={() => setShowQuickLauncher(true)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px 0' }}
        >
          <Zap size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Fitur</span>
        </button>
      </nav>

      {/* QUICK LAUNCHER MODAL DRAWER */}
      {showQuickLauncher && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', borderRadius: '28px 28px 0 0', padding: 24, background: '#ffffff', boxShadow: '0 -10px 30px rgba(0,0,0,0.2)', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#247d68', fontWeight: 800, textTransform: 'uppercase' }}>RESTOQU ENTERPRISE</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900 }}>Semua Fitur & Modul</h3>
              </div>
              <button onClick={() => setShowQuickLauncher(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
              <Link href="/menu" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <Utensils size={22} style={{ color: '#247d68', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>Kelola Menu</span>
              </Link>

              <Link href="/service-points" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <QrCode size={22} style={{ color: '#247d68', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>QR Meja</span>
              </Link>

              <Link href="/recipes" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <ChefHat size={22} style={{ color: '#d97706', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>Resep BOM</span>
              </Link>

              <Link href="/inventory" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <Package size={22} style={{ color: '#dc2626', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>Stok Waste</span>
              </Link>

              <Link href="/purchasing" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <ShoppingBag size={22} style={{ color: '#0284c7', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>PO Supplier</span>
              </Link>

              <Link href="/loyalty" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <Gift size={22} style={{ color: '#eab308', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>Voucher</span>
              </Link>

              <Link href="/employees" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <Users size={22} style={{ color: '#3b82f6', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>Staf Shift</span>
              </Link>

              <Link href="/automation" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <Zap size={22} style={{ color: '#247d68', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>Otomasi</span>
              </Link>

              <Link href="/reports" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <TrendingUp size={22} style={{ color: '#247d68', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>Laporan</span>
              </Link>

              <Link href="/settings" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <Settings size={22} style={{ color: '#6b7280', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>Pengaturan</span>
              </Link>

              <Link href="/admin" onClick={() => setShowQuickLauncher(false)} style={{ background: '#f9fafb', borderRadius: 16, padding: '12px 6px', textAlign: 'center', textDecoration: 'none', color: '#1d2925', border: '1px solid #e5e7eb' }}>
                <ShieldCheck size={22} style={{ color: '#9333ea', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, display: 'block' }}>SaaS Admin</span>
              </Link>
            </div>

            <button
              onClick={() => setShowQuickLauncher(false)}
              style={{ width: '100%', padding: 12, borderRadius: 14, background: '#f3f4f6', border: 'none', fontWeight: 800, cursor: 'pointer' }}
            >
              Tutup Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
