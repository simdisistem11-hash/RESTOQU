'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp, DollarSign, Download, ArrowLeft, Calendar, CreditCard, PieChart,
  FileSpreadsheet, Lock, Unlock, ShieldCheck, CheckCircle2, Clock, Printer, User, AlertCircle, Utensils,
  Layers, Package, Settings
} from 'lucide-react';
import Link from 'next/link';
import { exportToCSV, printReportPDF } from '@/lib/exporter';

export default function BusinessReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'shifts'>('sales');
  const [dateRange, setDateRange] = useState('today');

  const handleExportReport = () => {
    if (activeTab === 'sales') {
      const headers = ['Order ID', 'Waktu', 'Lokasi/Meja', 'Metode Bayar', 'Total Transaksi (Rp)'];
      const rows = transactions.map(t => [t.id, t.time, t.table, t.method, t.total]);
      exportToCSV('Laporan_Penjualan_RestoQu', headers, rows);
    } else {
      const headers = ['Nama Kasir', 'Jam Buka', 'Jam Tutup', 'Omset Tunai', 'Non Tunai', 'Setoran Fisik', 'Selisih'];
      const rows = shifts.map(s => [
        s.cashierName,
        new Date(s.startTime).toLocaleTimeString('id-ID'),
        s.endTime ? new Date(s.endTime).toLocaleTimeString('id-ID') : 'Aktif',
        s.totalCashSales || 0,
        s.totalNonCashSales || 0,
        s.actualEndingCash || 0,
        s.differenceAmount || 0
      ]);
      exportToCSV('Laporan_Shift_Kasir_RestoQu', headers, rows);
    }
  };

  const handlePrintPDF = () => {
    if (activeTab === 'sales') {
      const headers = ['Order ID', 'Waktu', 'Lokasi/Meja', 'Metode Bayar', 'Total (Rp)'];
      const rows = transactions.map(t => [t.id, t.time, t.table, t.method, `Rp ${t.total.toLocaleString('id-ID')}`]);
      printReportPDF('Laporan Penjualan Harian', 'Bismillah Resto • Ringkasan Transaksi', headers, rows);
    } else {
      const headers = ['Nama Kasir', 'Waktu Shift', 'Status', 'Setoran Fisik', 'Selisih'];
      const rows = shifts.map(s => [
        s.cashierName,
        `${new Date(s.startTime).toLocaleTimeString('id-ID')} - ${s.endTime ? new Date(s.endTime).toLocaleTimeString('id-ID') : 'Aktif'}`,
        s.status,
        `Rp ${(s.actualEndingCash || 0).toLocaleString('id-ID')}`,
        `Rp ${(s.differenceAmount || 0).toLocaleString('id-ID')}`
      ]);
      printReportPDF('Laporan Shift & Cash Count', 'Bismillah Resto • Rekap Kasir', headers, rows);
    }
  };

  // Shifts state
  const [shifts, setShifts] = useState<any[]>([]);
  const [shiftSummary, setShiftSummary] = useState<any>({
    totalShifts: 0,
    totalSetoranFisik: 0,
    totalOmsetNonTunai: 0,
    totalSelisih: 0
  });
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [confirmedShifts, setConfirmedShifts] = useState<{ [id: string]: boolean }>({});

  const salesBreakdown = [
    { method: 'QRIS / Digital', amount: 1850000, count: 26, percentage: '53.6%', color: '#247d68' },
    { method: 'CASH / Tunai', amount: 1120000, count: 16, percentage: '32.4%', color: '#d97706' },
    { method: 'EDC / Debit Card', amount: 480000, count: 6, percentage: '14.0%', color: '#0284c7' }
  ];

  const transactions = [
    { id: '1024', time: '14:22', table: 'Meja 12', method: 'QRIS', total: 41580 },
    { id: '1023', time: '13:50', table: 'Meja 03', method: 'CASH', total: 57750 },
    { id: '1022', time: '13:15', table: 'Meja 01', method: 'DEBIT', total: 88000 },
    { id: '1021', time: '12:40', table: 'Ruang VIP 01', method: 'QRIS', total: 245000 }
  ];

  // Demo Fallback Shifts for Owner
  const demoShifts = [
    {
      id: 'shift-owner-1',
      cashierName: 'Ahmad (Kasir Pagi)',
      startTime: new Date(Date.now() - 3600000 * 9).toISOString(),
      endTime: new Date(Date.now() - 3600000 * 1).toISOString(),
      status: 'CLOSED',
      startingCash: 200000,
      expectedCash: 850000,
      actualEndingCash: 850000,
      differenceAmount: 0,
      differenceStatus: 'PAS',
      totalCashSales: 650000,
      totalNonCashSales: 420000,
      totalSales: 1070000,
      totalOrdersCount: 14,
      notes: 'Shift Pagi Uang Pas.'
    },
    {
      id: 'shift-owner-2',
      cashierName: 'Siti (Kasir Siang)',
      startTime: new Date(Date.now() - 3600000 * 24).toISOString(),
      endTime: new Date(Date.now() - 3600000 * 16).toISOString(),
      status: 'CLOSED',
      startingCash: 200000,
      expectedCash: 1150000,
      actualEndingCash: 1148000,
      differenceAmount: -2000,
      differenceStatus: 'DEFICIT',
      totalCashSales: 950000,
      totalNonCashSales: 680000,
      totalSales: 1630000,
      totalOrdersCount: 22,
      notes: 'Ada kembalian kurang Rp 2.000 (tidak ada pecahan koin).'
    }
  ];

  const fetchOwnerShifts = async () => {
    setShiftsLoading(true);
    try {
      const res = await fetch('/api/owner/shifts');
      const data = await res.json();
      if (data.success && data.shifts && data.shifts.length > 0) {
        setShifts(data.shifts);
        setShiftSummary(data.summary);
      } else {
        setShifts(demoShifts);
        setShiftSummary({
          totalShifts: demoShifts.length,
          totalSetoranFisik: demoShifts.reduce((s, x) => s + x.actualEndingCash, 0),
          totalOmsetNonTunai: demoShifts.reduce((s, x) => s + x.totalNonCashSales, 0),
          totalSelisih: demoShifts.reduce((s, x) => s + x.differenceAmount, 0)
        });
      }
    } catch (err) {
      setShifts(demoShifts);
      setShiftSummary({
        totalShifts: demoShifts.length,
        totalSetoranFisik: demoShifts.reduce((s, x) => s + x.actualEndingCash, 0),
        totalOmsetNonTunai: demoShifts.reduce((s, x) => s + x.totalNonCashSales, 0),
        totalSelisih: demoShifts.reduce((s, x) => s + x.differenceAmount, 0)
      });
    } finally {
      setShiftsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'shifts') {
      fetchOwnerShifts();
    }
  }, [activeTab]);

  const handleConfirmSetoran = (id: string) => {
    setConfirmedShifts(prev => ({ ...prev, [id]: true }));
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
          <Link href="/" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 700 }}>LAPORAN & AUDIT</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Ringkasan Bisnis</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleExportReport} title="Export CSV / Excel" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', color: '#247d68', border: '1px solid #247d68', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Download size={16} />
          </button>
          <button onClick={handlePrintPDF} title="Cetak PDF" style={{ width: 36, height: 36, borderRadius: '50%', background: '#247d68', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Printer size={16} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        {/* Sub Tab Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16, background: '#ffffff', padding: 4, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <button
            onClick={() => setActiveTab('sales')}
            style={{
              padding: '8px 6px', borderRadius: 12, border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
              background: activeTab === 'sales' ? '#247d68' : 'transparent',
              color: activeTab === 'sales' ? '#ffffff' : '#6b7280'
            }}
          >
            📊 Omset & Penjualan
          </button>

          <button
            onClick={() => setActiveTab('shifts')}
            style={{
              padding: '8px 6px', borderRadius: 12, border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
              background: activeTab === 'shifts' ? '#247d68' : 'transparent',
              color: activeTab === 'shifts' ? '#ffffff' : '#6b7280'
            }}
          >
            🔒 Setoran Shift Kasir
          </button>
        </div>
        {/* Date Range Selector */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: 'yesterday', label: 'Kemarin' },
            { id: 'week', label: '7 Hari Terakhir' },
            { id: 'month', label: 'Bulan Ini' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setDateRange(p.id)}
              style={{
                padding: '6px 14px', borderRadius: 9999, border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap',
                background: dateRange === p.id ? '#247d68' : '#ffffff',
                color: dateRange === p.id ? '#ffffff' : '#6b7280',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OMSET & PENJUALAN */}
        {activeTab === 'sales' && (
          <div>
            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: '#ffffff', borderRadius: 20, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700 }}>TOTAL OMSET</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#247d68', marginTop: 2 }}>Rp3.450.000</h3>
                <span style={{ fontSize: '0.68rem', color: '#166534', background: '#dcfce7', padding: '2px 6px', borderRadius: 9999, fontWeight: 800, marginTop: 4, display: 'inline-block' }}>
                  ↑ 12.5% vs kemarin
                </span>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 20, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700 }}>TRANSAKSI LUNAS</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d2925', marginTop: 2 }}>48 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Struk</span></h3>
                <span style={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: 700, marginTop: 4, display: 'inline-block' }}>
                  Rata-rata: Rp71.875
                </span>
              </div>
            </div>

            {/* Payment Method Breakdown */}
            <div style={{ background: '#ffffff', borderRadius: 22, padding: 18, marginBottom: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1d2925' }}>METODE PEMBAYARAN</h4>
                <span style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 800 }}>3 Metode</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {salesBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>{item.method} ({item.count} Struk)</span>
                      <span style={{ color: item.color, fontWeight: 900 }}>Rp{item.amount.toLocaleString('id-ID')} ({item.percentage})</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#f3f4f6', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ width: item.percentage, height: '100%', background: item.color, borderRadius: 9999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions List */}
            <div style={{ background: '#ffffff', borderRadius: 22, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1d2925' }}>TRANSAKSI TERAKHIR</h4>
                <Link href="/cashier" style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 800, textDecoration: 'none' }}>
                  Lihat POS →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {transactions.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: 8, fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#1d2925' }}>Order #{t.id}</span>
                      <p style={{ fontSize: '0.72rem', color: '#6b7280' }}>{t.table} • Jam {t.time}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 900, color: '#247d68' }}>Rp{t.total.toLocaleString('id-ID')}</span>
                      <span style={{ fontSize: '0.68rem', display: 'block', color: '#6b7280', fontWeight: 700 }}>{t.method}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT SETORAN SHIFT KASIR */}
        {activeTab === 'shifts' && (
          <div>
            {/* Shift Audit Summary */}
            <div style={{ background: '#173f35', color: '#ffffff', borderRadius: 22, padding: 18, marginBottom: 16, boxShadow: '0 4px 16px rgba(23,63,53,0.3)' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 800, textTransform: 'uppercase' }}>TOTAL REKAP SETORAN SHIFT</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
                <div>
                  <span style={{ fontSize: '0.68rem', opacity: 0.7, display: 'block' }}>SETORAN FISIK LACI (CASH)</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#a7f3d0' }}>Rp{shiftSummary.totalSetoranFisik?.toLocaleString('id-ID')}</h3>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', opacity: 0.7, display: 'block' }}>OMSET DIGITAL (NON-CASH)</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8' }}>Rp{shiftSummary.totalOmsetNonTunai?.toLocaleString('id-ID')}</h3>
                </div>
              </div>
            </div>

            {shiftsLoading ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#6b7280', fontWeight: 700 }}>
                Memuat Data Setoran Shift...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {shifts.map(s => {
                  const isConfirmed = confirmedShifts[s.id];
                  const formattedStart = new Date(s.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                  const formattedEnd = s.endTime ? new Date(s.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Masih Aktif';

                  return (
                    <div key={s.id} style={{ background: '#ffffff', borderRadius: 22, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)', borderLeft: s.differenceAmount === 0 ? '4px solid #247d68' : '4px solid #dc2626' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#247d68', background: '#dff3e9', padding: '2px 8px', borderRadius: 9999 }}>
                            SHIFT KASIR
                          </span>
                          <h3 style={{ fontSize: '1rem', fontWeight: 900, marginTop: 4 }}>{s.cashierName}</h3>
                          <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 2 }}>
                            Jam Shift: {formattedStart} - {formattedEnd}
                          </p>
                        </div>

                        <span style={{
                          padding: '4px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 800,
                          background: s.differenceAmount === 0 ? '#dcfce7' : '#fee2e2',
                          color: s.differenceAmount === 0 ? '#166534' : '#991b1b'
                        }}>
                          {s.differenceStatus === 'PAS' ? '✅ PAS' : s.differenceStatus === 'SURPLUS' ? '⚠️ SURPLUS' : '❌ DEFICIT'}
                        </span>
                      </div>

                      <div style={{ background: '#f9fafb', borderRadius: 14, padding: 12, marginBottom: 12, fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: '#6b7280' }}>Modal Awal Kas:</span>
                          <span style={{ fontWeight: 700 }}>Rp{s.startingCash?.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: '#6b7280' }}>Penjualan Tunai (Cash):</span>
                          <span style={{ fontWeight: 700, color: '#166534' }}>+Rp{s.totalCashSales?.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: '#6b7280' }}>Uang Seharusnya di Laci:</span>
                          <span style={{ fontWeight: 700 }}>Rp{s.expectedCash?.toLocaleString('id-ID')}</span>
                        </div>

                        <div style={{ borderTop: '1px dashed #d1d5db', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
                          <span>SETORAN FISIK LACI:</span>
                          <span style={{ color: '#247d68' }}>Rp{s.actualEndingCash?.toLocaleString('id-ID')}</span>
                        </div>

                        {s.differenceAmount !== 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: '#dc2626', fontWeight: 800 }}>
                            <span>Selisih Rekonsiliasi:</span>
                            <span>Rp{s.differenceAmount?.toLocaleString('id-ID')}</span>
                          </div>
                        )}
                      </div>

                      {s.notes && (
                        <p style={{ fontSize: '0.75rem', color: '#4b5563', fontStyle: 'italic', marginBottom: 12, background: '#fffbe3', padding: '6px 10px', borderRadius: 8 }}>
                          Catatan Kasir: "{s.notes}"
                        </p>
                      )}

                      {isConfirmed ? (
                        <div style={{ background: '#dcfce7', color: '#166534', padding: '8px', borderRadius: 12, textAlign: 'center', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <CheckCircle2 size={16} /> Setoran Terverifikasi Diterima Owner
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConfirmSetoran(s.id)}
                          style={{
                            width: '100%', padding: '10px', borderRadius: 12, background: '#247d68', color: '#ffffff',
                            border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                          }}
                        >
                          <ShieldCheck size={16} /> Verifikasi & Terima Setoran Kasir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
        <Link href="/reports" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#247d68', padding: '4px 0' }}>
          <TrendingUp size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>Laporan</span>
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
