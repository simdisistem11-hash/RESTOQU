'use client';

import React, { useState } from 'react';
import { Settings, Save, ArrowLeft, CheckCircle2, Building, DollarSign, Receipt, Volume2, HardDrive, Layers, Utensils, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantSettingsPage() {
  const [tenantName, setTenantName] = useState('Bismillah Resto');
  const [address, setAddress] = useState('Jl. Trunojoyo No. 45, Sumenep, Madura');
  const [phone, setPhone] = useState('081234567890');

  const [taxPercentage, setTaxPercentage] = useState(10);
  const [servicePercentage, setServicePercentage] = useState(5);

  const [receiptHeader, setReceiptHeader] = useState('Bismillah Resto - Sumenep\nJl. Trunojoyo No. 45');
  const [receiptFooter, setReceiptFooter] = useState('Terima kasih atas kunjungan Anda!\nFollow Instagram: @bismillahresto');

  const [voiceGender, setVoiceGender] = useState<'FEMALE' | 'MALE'>('FEMALE');
  const [driveUrl, setDriveUrl] = useState('https://script.google.com/macros/s/AKfycbx_demo_restoqu/exec');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
            <p style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 700 }}>PUSAT KONFIGURASI</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Pengaturan Restoran</h1>
          </div>
        </div>
      </header>

      {/* Main Settings Form */}
      <main style={{ padding: '0 20px' }}>
        {saveSuccess && (
          <div style={{ padding: 14, background: '#dcfce7', color: '#166534', borderRadius: 16, marginBottom: 16, fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={20} /> Pengaturan berhasil disimpan!
          </div>
        )}

        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Section 1: Profil Restoran */}
          <div style={{ background: '#ffffff', borderRadius: 24, padding: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#247d68' }}>
              <Building size={18} /> Profil & Informasi Restoran
            </h2>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Nama Restoran</label>
              <input
                type="text"
                value={tenantName}
                onChange={e => setTenantName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Alamat Outlet Principal</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Nomor Telepon Restoran</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Section 2: Pajak & Fee */}
          <div style={{ background: '#ffffff', borderRadius: 24, padding: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#247d68' }}>
              <DollarSign size={18} /> Pajak Restoran & Service Fee
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Pajak Restoran (%)</label>
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={e => setTaxPercentage(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', fontWeight: 700, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Service Charge (%)</label>
                <input
                  type="number"
                  value={servicePercentage}
                  onChange={e => setServicePercentage(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', fontWeight: 700, outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Header & Footer Struk Custom */}
          <div style={{ background: '#ffffff', borderRadius: 24, padding: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#247d68' }}>
              <Receipt size={18} /> Struk Kasir Thermal (Header/Footer)
            </h2>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Header Struk</label>
              <textarea
                rows={2}
                value={receiptHeader}
                onChange={e => setReceiptHeader(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Footer Struk</label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={e => setReceiptFooter(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          {/* Section 4: Voice Calling Announcement */}
          <div style={{ background: '#ffffff', borderRadius: 24, padding: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#247d68' }}>
              <Volume2 size={18} /> Suara Panggilan Calling System
            </h2>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setVoiceGender('FEMALE')}
                style={{
                  flex: 1, padding: 12, borderRadius: 12, border: voiceGender === 'FEMALE' ? '2px solid #247d68' : '1px solid #e5e7eb',
                  background: voiceGender === 'FEMALE' ? '#dff3e9' : '#f9fafb', color: voiceGender === 'FEMALE' ? '#247d68' : '#4b5563',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                👩 Suara Wanita (Female)
              </button>
              <button
                type="button"
                onClick={() => setVoiceGender('MALE')}
                style={{
                  flex: 1, padding: 12, borderRadius: 12, border: voiceGender === 'MALE' ? '2px solid #247d68' : '1px solid #e5e7eb',
                  background: voiceGender === 'MALE' ? '#dff3e9' : '#f9fafb', color: voiceGender === 'MALE' ? '#247d68' : '#4b5563',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                👨 Suara Pria (Male)
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%', padding: 14, borderRadius: 16, background: '#247d68', color: '#ffffff', border: 'none',
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(36, 125, 104, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <Save size={18} /> Simpan Pengaturan Restoran
          </button>
        </form>
      </main>

      {/* PERMANENT FIXED OWNER BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '10px 12px calc(14px + env(safe-area-inset-bottom, 0px))', zIndex: 99999, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)'
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
        <Link href="/settings" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#247d68', padding: '4px 0' }}>
          <Settings size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>Setting</span>
        </Link>
      </nav>
    </div>
  );
}
