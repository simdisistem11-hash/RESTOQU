'use client';

import React, { useState } from 'react';
import { ShoppingCart, Truck, Plus, ArrowLeft, CheckCircle2, Phone, Building, Layers, Utensils, TrendingUp, Package, Settings } from 'lucide-react';
import Link from 'next/link';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  itemsSummary: string;
  totalCost: number;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED';
  date: string;
}

export default function PurchasingPage() {
  const [suppliers] = useState<Supplier[]>([
    { id: 's1', name: 'PT Beras Makmur Jaya', contact: 'Pak Budi', phone: '081234567890' },
    { id: 's2', name: 'CV Daging Nusantara', contact: 'Ibu Siti', phone: '081987654321' },
    { id: 's3', name: 'UD Kopi Arabika Barokah', contact: 'Mas Joko', phone: '081555443322' }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    { id: 'po1', poNumber: 'PO-2026-001', supplierName: 'PT Beras Makmur Jaya', itemsSummary: 'Beras Premium (100 kg)', totalCost: 1400000, status: 'RECEIVED', date: '25 Aug 2026' },
    { id: 'po2', poNumber: 'PO-2026-002', supplierName: 'CV Daging Nusantara', itemsSummary: 'Daging Ayam Broiler (30 kg)', totalCost: 1140000, status: 'ORDERED', date: '28 Aug 2026' }
  ]);

  const handleMarkReceived = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        return { ...po, status: 'RECEIVED' };
      }
      return po;
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
            <p style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>PURCHASING & SUPPLIER</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Purchase Order (PO)</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12 }}>Daftar Purchase Order</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {purchaseOrders.map(po => (
            <div key={po.id} style={{ background: '#ffffff', borderRadius: 24, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>{po.poNumber}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700,
                  background: po.status === 'RECEIVED' ? '#dcfce7' : '#fef3c7',
                  color: po.status === 'RECEIVED' ? '#166534' : '#92400e'
                }}>
                  {po.status === 'RECEIVED' ? '🟢 Received (Stock In)' : '🚚 Ordered'}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4b5563' }}>{po.supplierName}</p>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 2 }}>{po.itemsSummary}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', marginTop: 12, paddingTop: 10 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#247d68' }}>
                  Rp{po.totalCost.toLocaleString('id-ID')}
                </span>
                {po.status === 'ORDERED' && (
                  <button
                    onClick={() => handleMarkReceived(po.id)}
                    style={{ padding: '6px 12px', borderRadius: 10, background: '#247d68', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Terima Barang (Stock In)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12 }}>Daftar Supplier Utama</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {suppliers.map(s => (
            <div key={s.id} style={{ background: '#ffffff', borderRadius: 20, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{s.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Kontak: {s.contact} ({s.phone})</p>
              </div>
              <a href={`tel:${s.phone}`} style={{ width: 34, height: 34, borderRadius: '50%', background: '#dff3e9', color: '#247d68', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <Phone size={16} />
              </a>
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
