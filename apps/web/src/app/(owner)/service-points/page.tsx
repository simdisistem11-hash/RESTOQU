'use client';

import React, { useState } from 'react';
import { QrCode, Plus, Printer, ArrowLeft, CheckCircle2, Copy, Sparkles, Layers, Utensils, TrendingUp, Package, Settings, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ServicePoint {
  id: string;
  code: string;
  displayName: string;
  qrSecretKey: string;
  type: 'TABLE' | 'COUNTER' | 'VIP' | 'TAKEAWAY';
  status: 'VACANT' | 'OCCUPIED' | 'RESERVED';
}

export default function ServicePointsPage() {
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([
    { id: '1', code: 'M01', displayName: 'Meja 01', qrSecretKey: 'qr-bismillah-m01', type: 'TABLE', status: 'VACANT' },
    { id: '2', code: 'M02', displayName: 'Meja 02', qrSecretKey: 'qr-bismillah-m02', type: 'TABLE', status: 'OCCUPIED' },
    { id: '3', code: 'M03', displayName: 'Meja 03', qrSecretKey: 'qr-bismillah-m03', type: 'TABLE', status: 'VACANT' },
    { id: '4', code: 'VIP01', displayName: 'Ruang VIP 01', qrSecretKey: 'qr-bismillah-vip01', type: 'VIP', status: 'VACANT' },
    { id: '5', code: 'TA01', displayName: 'Kasir Takeaway', qrSecretKey: 'qr-bismillah-ta01', type: 'TAKEAWAY', status: 'VACANT' }
  ]);

  const [selectedPoint, setSelectedPoint] = useState<ServicePoint | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Service Point Form
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'TABLE' | 'COUNTER' | 'VIP' | 'TAKEAWAY'>('TABLE');

  const handleAddServicePoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newPoint: ServicePoint = {
      id: `${Date.now()}`,
      code: newCode.toUpperCase(),
      displayName: newName,
      qrSecretKey: `qr-bismillah-${newCode.toLowerCase()}`,
      type: newType,
      status: 'VACANT'
    };

    setServicePoints(prev => [...prev, newPoint]);
    setShowAddModal(false);
    setNewCode('');
    setNewName('');
  };

  const getQRUrl = (secretKey: string) => {
    return `http://localhost:3000/r/bismillah-resto/${secretKey}`;
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
          <Link href="/dashboard" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 700 }}>RESTOQU SERVICE POINTS</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>QR Code Meja Restoran</h1>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: '#247d68', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}
        >
          <Plus size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {servicePoints.map(point => (
            <div
              key={point.id}
              style={{
                background: '#ffffff', borderRadius: 24, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{point.displayName}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700,
                    background: point.status === 'OCCUPIED' ? '#fef3c7' : '#dcfce7',
                    color: point.status === 'OCCUPIED' ? '#92400e' : '#166534'
                  }}>
                    {point.status === 'OCCUPIED' ? '🔴 Terisi' : '🟢 Kosong'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>Kode: {point.code} • {point.type}</p>
              </div>

              <button
                onClick={() => setSelectedPoint(point)}
                style={{
                  padding: '9px 14px', borderRadius: 14, background: '#dff3e9', color: '#247d68',
                  border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <QrCode size={16} /> Kartu QR
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* ADD SERVICE POINT MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: '#ffffff', borderRadius: '28px 28px 0 0', padding: 24, boxShadow: '0 -10px 30px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16 }}>Tambah Meja / Service Point</h3>
            <form onSubmit={handleAddServicePoint}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Kode Lokasi (misal: M04)</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="M04"
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Nama Tampilan (misal: Meja 04)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Meja 04"
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Tipe Service Point</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', outline: 'none', fontWeight: 600 }}
                >
                  <option value="TABLE">Meja Makan (TABLE)</option>
                  <option value="VIP">Ruang VIP (VIP)</option>
                  <option value="COUNTER">Counter Kasir (COUNTER)</option>
                  <option value="TAKEAWAY">Takeaway / Drive Thru</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: 12, borderRadius: 14, background: '#f3f4f6', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" style={{ flex: 2, padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  Simpan Meja Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE QR CODE CARD MODAL */}
      {selectedPoint && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#ffffff', borderRadius: 28, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            {/* Printable Frame Box */}
            <div style={{
              borderRadius: 24, background: 'linear-gradient(135deg, #dff3e9 0%, #f7eadc 100%)',
              padding: 24, border: '2px solid #247d68', boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 1 }}>BISMILLAH RESTO</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1d2925', marginTop: 2 }}>{selectedPoint.displayName}</h2>

              {/* QR Image Demonstration */}
              <div style={{
                margin: '16px auto', width: 170, height: 170, background: '#ffffff', borderRadius: 20,
                padding: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getQRUrl(selectedPoint.qrSecretKey))}`}
                  alt={selectedPoint.displayName}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1d2925' }}>SCAN UNTUK PESAN MENU</p>
              <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: 2 }}>Arahkan kamera smartphone ke QR Code ini</p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setSelectedPoint(null)} style={{ flex: 1, padding: 12, borderRadius: 14, background: '#f3f4f6', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Tutup
              </button>
              <button onClick={() => window.print()} style={{ flex: 1, padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Printer size={16} /> Cetak QR
              </button>
            </div>
          </div>
        </div>
      )}

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
