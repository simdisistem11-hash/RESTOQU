'use client';

import React, { useState } from 'react';
import { Zap, Plus, ArrowLeft, CheckCircle2, ToggleLeft, ToggleRight, Sparkles, Layers, Utensils, TrendingUp, Package, Settings } from 'lucide-react';
import Link from 'next/link';

interface AutomationRule {
  id: string;
  name: string;
  whenEvent: string;
  thenAction: string;
  isActive: boolean;
}

export default function AutomationCenterPage() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'r1',
      name: 'Otomasi Panggilan Suara Pesanan Siap',
      whenEvent: 'WHEN Order status becomes READY',
      thenAction: 'THEN Add to Calling Queue & Trigger Voice Announcement',
      isActive: true
    },
    {
      id: 'r2',
      name: 'Otomasi Cetak Struk Pembayaran Lunas',
      whenEvent: 'WHEN Payment status becomes PAID',
      thenAction: 'THEN Mark Order Completed & Auto Print Thermal Receipt',
      isActive: true
    },
    {
      id: 'r3',
      name: 'Peringatan Stok Menipis ke Staff Inventory',
      whenEvent: 'WHEN Ingredient quantity < minimumStock',
      thenAction: 'THEN Create Low-Stock Alert & Send Notification to Inventory Staff',
      isActive: true
    }
  ]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, isActive: !r.isActive };
      }
      return r;
    }));
  };

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
      {/* Mobile Header */}
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
          <Link href="/dashboard" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 700 }}>AUTOMATION CENTER</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Mesin Otomasi (WHEN → THEN)</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        <div style={{ background: '#dff3e9', borderRadius: 22, padding: 16, marginBottom: 20, border: '1px solid #a7f3d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={24} style={{ color: '#247d68' }} />
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#166534' }}>Rule Engine RestoQu</h3>
              <p style={{ fontSize: '0.78rem', color: '#166534', marginTop: 2 }}>Otomatiskan alur dapur, panggilan, struk, dan notifikasi persediaan.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rules.map(rule => (
            <div key={rule.id} style={{ background: '#ffffff', borderRadius: 24, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{rule.name}</h4>
                <button onClick={() => toggleRule(rule.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: rule.isActive ? '#247d68' : '#9ca3af' }}>
                  {rule.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <div style={{ background: '#f9fafb', borderRadius: 14, padding: 12, fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 700, color: '#d97706' }}>⚡ {rule.whenEvent}</div>
                <div style={{ fontWeight: 700, color: '#247d68' }}>🚀 {rule.thenAction}</div>
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
