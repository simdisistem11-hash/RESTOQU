'use client';

import React, { useState } from 'react';
import { Users, UserPlus, ArrowLeft, Shield, Clock, CheckCircle2, Layers, Utensils, TrendingUp, Package, Settings } from 'lucide-react';
import Link from 'next/link';

interface StaffEmployee {
  id: string;
  name: string;
  role: string;
  email: string;
  shift: string;
  status: 'ACTIVE' | 'OFF';
}

export default function EmployeesShiftPage() {
  const [employees] = useState<StaffEmployee[]>([
    { id: 'e1', name: 'Ahmad Owner', role: 'RESTAURANT_OWNER', email: 'owner@bismillah.com', shift: 'All Shifts', status: 'ACTIVE' },
    { id: 'e2', name: 'Budi Kasir', role: 'CASHIER', email: 'cashier@bismillah.com', shift: 'Shift Pagi (07:00 - 15:00)', status: 'ACTIVE' },
    { id: 'e3', name: 'Chef Joko', role: 'KITCHEN', email: 'kitchen@bismillah.com', shift: 'Shift Pagi (07:00 - 15:00)', status: 'ACTIVE' },
    { id: 'e4', name: 'Rudi Waiter', role: 'WAITER', email: 'waiter@bismillah.com', shift: 'Shift Malam (15:00 - 23:00)', status: 'ACTIVE' },
    { id: 'e5', name: 'Dewi Inventory', role: 'INVENTORY_STAFF', email: 'inventory@bismillah.com', shift: 'Shift Pagi (07:00 - 15:00)', status: 'OFF' }
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
            <p style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>STAF & SHIFT KERJA</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Karyawan & Shift</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {employees.map(emp => (
            <div key={emp.id} style={{ background: '#ffffff', borderRadius: 22, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{emp.name}</h3>
                  <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 700, background: '#dff3e9', color: '#247d68' }}>
                    {emp.role}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>Email: {emp.email}</p>
                <p style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, marginTop: 2 }}>{emp.shift}</p>
              </div>

              <span style={{
                padding: '4px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700,
                background: emp.status === 'ACTIVE' ? '#dcfce7' : '#f3f4f6',
                color: emp.status === 'ACTIVE' ? '#166534' : '#6b7280'
              }}>
                {emp.status === 'ACTIVE' ? '🟢 Task On' : '⚪ Off Shift'}
              </span>
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
