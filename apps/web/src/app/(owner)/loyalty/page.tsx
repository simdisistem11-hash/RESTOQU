'use client';

import React, { useState, useEffect } from 'react';
import {
  Gift, Award, Ticket, Plus, ArrowLeft, CheckCircle2, Star, Layers, Utensils,
  TrendingUp, Package, Settings, Users, Clock, Trash2, X, AlertCircle, Sparkles,
  Percent, DollarSign, Calendar
} from 'lucide-react';
import Link from 'next/link';

interface Voucher {
  id: string;
  code: string;
  title: string;
  discountType: 'PERCENT' | 'NOMINAL';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
  usageLimit?: number;
  usedCount: number;
  isHappyHour?: boolean;
  happyHourStart?: string;
  happyHourEnd?: string;
}

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  visitCount: number;
  totalSpend: number;
  points: number;
  tierInfo: {
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    label: string;
    color: string;
    bgBadge: string;
    discountPercent: number;
    minPoints: number;
    nextTierPoints: number | null;
  };
}

export default function LoyaltyAndPromosPage() {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'members'>('vouchers');

  // Vouchers State
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);

  // Form State
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'PERCENT' | 'NOMINAL'>('NOMINAL');
  const [newDiscountValue, setNewDiscountValue] = useState<number>(15000);
  const [newMinSpend, setNewMinSpend] = useState<number>(50000);
  const [newMaxDiscount, setNewMaxDiscount] = useState<number>(30000);
  const [newExpiryDate, setNewExpiryDate] = useState('2026-12-31');
  const [newUsageLimit, setNewUsageLimit] = useState<number>(100);
  const [newIsHappyHour, setNewIsHappyHour] = useState(false);
  const [newHappyHourStart, setNewHappyHourStart] = useState('14:00');
  const [newHappyHourEnd, setNewHappyHourEnd] = useState('17:00');

  // Customers State
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [customerSummary, setCustomerSummary] = useState<any>({
    totalMembers: 0,
    totalPoints: 0,
    tierCounts: { PLATINUM: 0, GOLD: 0, SILVER: 0, BRONZE: 0 }
  });
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const fetchVouchers = async () => {
    try {
      setLoadingVouchers(true);
      const res = await fetch('/api/owner/loyalty/vouchers');
      const data = await res.json();
      if (data.success && data.vouchers) {
        setVouchers(data.vouchers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVouchers(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const res = await fetch('/api/owner/loyalty/customers');
      const data = await res.json();
      if (data.success && data.customers) {
        setCustomers(data.customers);
        if (data.summary) setCustomerSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchCustomers();
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/owner/loyalty/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode,
          title: newTitle,
          discountType: newDiscountType,
          discountValue: Number(newDiscountValue),
          minSpend: Number(newMinSpend),
          maxDiscount: newDiscountType === 'PERCENT' ? Number(newMaxDiscount) : undefined,
          expiryDate: newExpiryDate,
          usageLimit: Number(newUsageLimit),
          isHappyHour: newIsHappyHour,
          happyHourStart: newIsHappyHour ? newHappyHourStart : undefined,
          happyHourEnd: newIsHappyHour ? newHappyHourEnd : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddVoucherModal(false);
        setNewCode('');
        setNewTitle('');
        fetchVouchers();
      } else {
        alert(data.error || 'Gagal membuat voucher');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm('Yakin ingin menghapus voucher ini?')) return;
    try {
      const res = await fetch(`/api/owner/loyalty/vouchers?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchVouchers();
      }
    } catch (err) {
      alert('Gagal menghapus voucher');
    }
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
          <Link href="/dashboard" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>PROMO & LOYALTY</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Voucher & Membership</h1>
          </div>
        </div>

        {activeTab === 'vouchers' && (
          <button
            onClick={() => setShowAddVoucherModal(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#247d68',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(36,125,104,0.3)'
            }}
          >
            <Plus size={18} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          marginBottom: 16,
          background: '#ffffff',
          padding: 4,
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <button
            onClick={() => setActiveTab('vouchers')}
            style={{
              padding: '10px 8px',
              borderRadius: 12,
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: activeTab === 'vouchers' ? '#247d68' : 'transparent',
              color: activeTab === 'vouchers' ? '#ffffff' : '#6b7280'
            }}
          >
            <Ticket size={16} /> Voucher & Promo
          </button>

          <button
            onClick={() => setActiveTab('members')}
            style={{
              padding: '10px 8px',
              borderRadius: 12,
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: activeTab === 'members' ? '#247d68' : 'transparent',
              color: activeTab === 'members' ? '#ffffff' : '#6b7280'
            }}
          >
            <Users size={16} /> Member ({customerSummary.totalMembers || customers.length})
          </button>
        </div>

        {/* TAB 1: VOUCHERS & PROMOS */}
        {activeTab === 'vouchers' && (
          <div>
            {/* Promo Banner Info */}
            <div style={{
              background: 'linear-gradient(135deg, #f7eadc 0%, #fef3c7 100%)',
              borderRadius: 20,
              padding: 16,
              marginBottom: 16,
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: '#ffffff', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800 }}>Diskon & Happy Hour Otomatis</h3>
                <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: 2 }}>Voucher dapat digunakan langsung saat pembayaran di Kasir atau Checkout QR meja.</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Daftar Voucher Restoran</h2>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{vouchers.length} Kupon Aktif</span>
            </div>

            {loadingVouchers ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#6b7280', fontSize: '0.85rem' }}>Memuat data voucher...</div>
            ) : vouchers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, background: '#ffffff', borderRadius: 20 }}>
                <Ticket size={40} style={{ margin: '0 auto 10px', color: '#9ca3af' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Belum Ada Voucher Promo</h3>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 4 }}>Klik tombol + di pojok kanan atas untuk membuat voucher baru.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {vouchers.map(v => (
                  <div
                    key={v.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: 20,
                      padding: 16,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                      borderLeft: '5px solid #247d68',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#247d68', letterSpacing: 0.5 }}>{v.code}</span>
                          {v.isHappyHour && (
                            <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={10} /> Happy Hour {v.happyHourStart}-{v.happyHourEnd}
                            </span>
                          )}
                        </div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '4px 0 2px' }}>{v.title}</h4>
                      </div>

                      <button
                        onClick={() => handleDeleteVoucher(v.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                        title="Hapus Voucher"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#6b7280' }}>
                      <div>
                        <span>Min. Belanja: <strong>Rp{v.minSpend.toLocaleString('id-ID')}</strong></span>
                        {v.discountType === 'PERCENT' && v.maxDiscount && (
                          <span style={{ marginLeft: 6 }}>(Maks. Rp{v.maxDiscount.toLocaleString('id-ID')})</span>
                        )}
                      </div>
                      <div>Digunakan: <strong>{v.usedCount}</strong>/{v.usageLimit || '∞'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMERS & MEMBERSHIP TIERS */}
        {activeTab === 'members' && (
          <div>
            {/* Tier Rules Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 6,
              marginBottom: 16
            }}>
              <div style={{ background: '#fef3c7', padding: '10px 6px', borderRadius: 14, textAlign: 'center' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, color: '#b45309' }}>BRONZE</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 900, color: '#78350f' }}>0-50 Pt</p>
                <span style={{ fontSize: '0.58rem', color: '#92400e' }}>Standard</span>
              </div>
              <div style={{ background: '#e0f2fe', padding: '10px 6px', borderRadius: 14, textAlign: 'center' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0369a1' }}>SILVER</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0c4a6e' }}>51-200</p>
                <span style={{ fontSize: '0.58rem', color: '#0369a1', fontWeight: 700 }}>Diskon 5%</span>
              </div>
              <div style={{ background: '#fef9c3', padding: '10px 6px', borderRadius: 14, textAlign: 'center', border: '1px solid #facc15' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, color: '#a16207' }}>GOLD</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 900, color: '#713f12' }}>201-500</p>
                <span style={{ fontSize: '0.58rem', color: '#a16207', fontWeight: 700 }}>Diskon 10%</span>
              </div>
              <div style={{ background: '#ede9fe', padding: '10px 6px', borderRadius: 14, textAlign: 'center', border: '1px solid #c084fc' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, color: '#6d28d9' }}>PLATINUM</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 900, color: '#4c1d95' }}>&gt;500 Pt</p>
                <span style={{ fontSize: '0.58rem', color: '#6d28d9', fontWeight: 700 }}>Diskon 15%</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Pelanggan Terdaftar</h2>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Total Poin: {customerSummary.totalPoints?.toLocaleString('id-ID')} Pt</span>
            </div>

            {loadingCustomers ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#6b7280', fontSize: '0.85rem' }}>Memuat data member...</div>
            ) : customers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, background: '#ffffff', borderRadius: 20 }}>
                <Users size={40} style={{ margin: '0 auto 10px', color: '#9ca3af' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Belum Ada Pelanggan</h3>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 4 }}>Pelanggan akan otomatis tercatat saat bertransaksi di Kasir atau Checkout meja.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {customers.map(c => (
                  <div
                    key={c.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: 18,
                      padding: 14,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>{c.name}</h4>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 9999,
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          background: c.tierInfo.bgBadge,
                          color: c.tierInfo.color
                        }}>
                          {c.tierInfo.tier}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>{c.phone} • {c.visitCount}x Kunjungan</p>
                      <p style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 700, marginTop: 2 }}>Total Belanja: Rp{c.totalSpend?.toLocaleString('id-ID')}</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d97706' }}>
                        {c.points} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Pt</span>
                      </div>
                      {c.tierInfo.nextTierPoints && (
                        <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
                          +{c.tierInfo.nextTierPoints - c.points} ke Tier berikutnya
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CREATE VOUCHER MODAL */}
      {showAddVoucherModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 400,
            padding: 20,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Buat Voucher Promo Baru</h3>
              <button onClick={() => setShowAddVoucherModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Kode Voucher (Kapital)</label>
                <input
                  type="text"
                  placeholder="Contoh: HEMAT20K"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: '0.85rem', fontWeight: 700, letterSpacing: 1 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Judul Promo</label>
                <input
                  type="text"
                  placeholder="Contoh: Potongan Langsung Rp 20.000"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Tipe Diskon</label>
                  <select
                    value={newDiscountType}
                    onChange={e => setNewDiscountType(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 8px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  >
                    <option value="NOMINAL">Nominal (Rp)</option>
                    <option value="PERCENT">Persentase (%)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>
                    {newDiscountType === 'NOMINAL' ? 'Nilai Potongan (Rp)' : 'Persen Diskon (%)'}
                  </label>
                  <input
                    type="number"
                    value={newDiscountValue}
                    onChange={e => setNewDiscountValue(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    value={newMinSpend}
                    onChange={e => setNewMinSpend(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Masa Berlaku s.d</label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={e => setNewExpiryDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 8px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Happy Hour Setting */}
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newIsHappyHour}
                    onChange={e => setNewIsHappyHour(e.target.checked)}
                  />
                  <span>Aktifkan Jam Khusus (Happy Hour)</span>
                </label>

                {newIsHappyHour && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Mulai Pukul</span>
                      <input
                        type="time"
                        value={newHappyHourStart}
                        onChange={e => setNewHappyHourStart(e.target.value)}
                        style={{ width: '100%', padding: 6, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Selesai Pukul</span>
                      <input
                        type="time"
                        value={newHappyHourEnd}
                        onChange={e => setNewHappyHourEnd(e.target.value)}
                        style={{ width: '100%', padding: 6, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddVoucherModal(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 12, background: '#f1f5f9', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: 12, borderRadius: 12, background: '#247d68', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  Simpan Voucher
                </button>
              </div>
            </form>
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
