'use client';

import React, { useState } from 'react';
import { Gift, Award, Ticket, Plus, ArrowLeft, CheckCircle2, Star, Layers, Utensils, TrendingUp, Package, Settings } from 'lucide-react';
import Link from 'next/link';

interface Voucher {
  id: string;
  code: string;
  discountText: string;
  minSpend: number;
  expiryDate: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
}

export default function LoyaltyVouchersPage() {
  const [vouchers] = useState<Voucher[]>([
    { id: 'v1', code: 'RESTOQU25K', discountText: 'Diskon Rp25.000 (Milestone 10 Transaksi)', minSpend: 100000, expiryDate: '31 Des 2026', status: 'ACTIVE' },
    { id: 'v2', code: 'ESKOPISERU', discountText: 'Gratis 1 Es Kopi Gula Aren', minSpend: 50000, expiryDate: '15 Sep 2026', status: 'ACTIVE' },
    { id: 'v3', code: 'SETIAMEMBER', discountText: 'Diskon 15% Member Silver', minSpend: 75000, expiryDate: '30 Nov 2026', status: 'ACTIVE' }
  ]);

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
            <p style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>LOYALTY & REWARDS</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Voucher & Poin Loyalty</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        {/* Loyalty Program Banner */}
        <div style={{ background: 'linear-gradient(135deg, #f7eadc 0%, #fef3c7 100%)', borderRadius: 24, padding: 20, marginBottom: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 16, background: '#ffffff', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Program Loyalty Pelanggan</h3>
              <p style={{ fontSize: '0.78rem', color: '#4b5563', marginTop: 2 }}>Dapatkan 1 Poin setiap transaksi Rp10.000 tanpa wajib login.</p>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12 }}>Daftar Voucher Restoran Aktif</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {vouchers.map(v => (
            <div key={v.id} style={{ background: '#ffffff', borderRadius: 24, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)', borderLeft: '6px solid #247d68' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#247d68', letterSpacing: 0.5 }}>{v.code}</span>
                <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700, background: '#dcfce7', color: '#166534' }}>
                  {v.status}
                </span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>{v.discountText}</h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Min. Belanja: Rp{v.minSpend.toLocaleString('id-ID')} • Berlaku s.d {v.expiryDate}</p>
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
