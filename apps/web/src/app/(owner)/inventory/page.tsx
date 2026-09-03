'use client';

import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, Trash2, Plus, ArrowLeft, RefreshCw, CheckCircle2, Utensils, Layers, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  costPerUnit: number;
}

interface WasteLog {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  reason: string;
  totalLoss: number;
  date: string;
}

export default function InventoryWastePage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'waste'>('stock');
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddWasteModal, setShowAddWasteModal] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [wasteQty, setWasteQty] = useState(1);
  const [wasteReason, setWasteReason] = useState('Basi / Kadaluarsa');

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/inventory');
      const data = await res.json();
      if (data.success) {
        if (data.items) setStockItems(data.items);
        if (data.wastes) setWasteLogs(data.wastes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleAddWasteLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemName) return;

    try {
      const res = await fetch('/api/owner/inventory/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: selectedItemName,
          quantity: wasteQty,
          reason: wasteReason
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchInventoryData();
        setShowAddWasteModal(false);
      }
    } catch (err) {
      console.error(err);
      setShowAddWasteModal(false);
    }
  };

  const totalWasteValue = wasteLogs.reduce((sum, log) => sum + log.totalLoss, 0);

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
          <Link href="/" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>INVENTARIS & STOK</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Stok Gudang & Waste</h1>
          </div>
        </div>

        <button onClick={fetchInventoryData} style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', color: '#d97706', border: '1px solid #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <RefreshCw size={16} />
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        {/* Sub Tab Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16, background: '#ffffff', padding: 4, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <button
            onClick={() => setActiveTab('stock')}
            style={{
              padding: '8px 6px', borderRadius: 12, border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
              background: activeTab === 'stock' ? '#d97706' : 'transparent',
              color: activeTab === 'stock' ? '#ffffff' : '#6b7280'
            }}
          >
            📦 Stok Gudang
          </button>

          <button
            onClick={() => setActiveTab('waste')}
            style={{
              padding: '8px 6px', borderRadius: 12, border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
              background: activeTab === 'waste' ? '#dc2626' : 'transparent',
              color: activeTab === 'waste' ? '#ffffff' : '#6b7280'
            }}
          >
            🗑️ Waste / Spoilage
          </button>
        </div>
        {/* TAB 1: STOK GUDANG */}
        {activeTab === 'stock' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#6b7280', fontWeight: 700 }}>
                Memuat Data Stok Inventaris...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stockItems.map(item => {
                  const isLow = item.quantity <= item.minStock;
                  return (
                    <div key={item.id} style={{ background: '#ffffff', borderRadius: 18, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: isLow ? '4px solid #dc2626' : '4px solid #247d68' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1d2925' }}>{item.name}</h4>
                          {isLow && (
                            <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: 9999, fontWeight: 800 }}>
                              Stok Menipis!
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                          {item.category} • HPP: Rp{item.costPerUnit.toLocaleString('id-ID')}/{item.unit}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: isLow ? '#dc2626' : '#247d68' }}>
                          {item.quantity} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.unit}</span>
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#9ca3af', display: 'block' }}>
                          Min: {item.minStock} {item.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WASTE / SPOILAGE LOGS */}
        {activeTab === 'waste' && (
          <div>
            {/* Loss Metric Summary */}
            <div style={{ background: '#fee2e2', borderRadius: 20, padding: 16, marginBottom: 14, border: '1px solid #fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL KERUGIAN WASTE</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#991b1b', marginTop: 2 }}>Rp{totalWasteValue.toLocaleString('id-ID')}</h3>
              </div>

              <button
                onClick={() => setShowAddWasteModal(true)}
                style={{ padding: '8px 14px', borderRadius: 12, background: '#dc2626', color: '#ffffff', border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={14} /> Catat Waste
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {wasteLogs.map(w => (
                <div key={w.id} style={{ background: '#ffffff', borderRadius: 18, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1d2925' }}>{w.itemName}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginTop: 2 }}>
                        Alasan: "{w.reason}"
                      </p>
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 2, display: 'block' }}>
                        Tanggal: {w.date}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#dc2626' }}>
                        -Rp{w.totalLoss.toLocaleString('id-ID')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', fontWeight: 700 }}>
                        {w.quantity} {w.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
        <Link href="/inventory" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#d97706', padding: '4px 0' }}>
          <Package size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>Stok</span>
        </Link>
        <Link href="/settings" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <Settings size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Setting</span>
        </Link>
      </nav>

      {/* Modal Add Waste Log */}
      {showAddWasteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#ffffff', borderRadius: 24, padding: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: 12 }}>Catat Bahan Rusak / Waste</h3>

            <form onSubmit={handleAddWasteLog}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>PILIH BAHAN INVENTARIS</label>
                <select
                  value={selectedItemName}
                  onChange={e => setSelectedItemName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                >
                  <option value="">-- Pilih Bahan --</option>
                  {stockItems.map(item => (
                    <option key={item.id} value={item.name}>{item.name} (Sisa: {item.quantity} {item.unit})</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>JUMLAH BAHAN TERBUANG</label>
                <input
                  type="number"
                  step="0.01"
                  value={wasteQty}
                  onChange={e => setWasteQty(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>ALASAN WASTE / DAMAGE</label>
                <select
                  value={wasteReason}
                  onChange={e => setWasteReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                >
                  <option value="Basi / Kadaluarsa">Basi / Kadaluarsa</option>
                  <option value="Rusak Penyimpanan / Kulkas Mati">Rusak Penyimpanan / Kulkas Mati</option>
                  <option value="Bocor / Kemasan Rusak">Bocor / Kemasan Rusak</option>
                  <option value="Kesalahan Masak (Human Error)">Kesalahan Masak (Human Error)</option>
                  <option value="Sampel / Tester Free">Sampel / Tester Free</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setShowAddWasteModal(false)} style={{ flex: 1, padding: 10, borderRadius: 12, background: '#f3f4f6', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" style={{ flex: 1, padding: 10, borderRadius: 12, background: '#dc2626', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>
                  Simpan Waste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
