'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Megaphone, CheckCircle2, RotateCcw } from 'lucide-react';

export default function CallingDisplayPage() {
  const [readyOrders, setReadyOrders] = useState<any[]>([
    { id: '1', orderNumber: '#1024', servicePointName: 'Meja 12', status: 'READY' },
    { id: '2', orderNumber: '#1025', servicePointName: 'Meja 03', status: 'READY' }
  ]);

  const fetchCallingOrders = async () => {
    try {
      const res = await fetch('/api/kds?tenantId=bismillah-resto');
      const data = await res.json();
      if (data.success && data.orders) {
        const readyOnly = data.orders.filter((o: any) => o.status === 'READY');
        if (readyOnly.length > 0) {
          setReadyOrders(readyOnly.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            servicePointName: o.servicePoint?.displayName || 'Meja / Area',
            status: 'READY'
          })));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCallingOrders();

    const eventSource = new EventSource('/api/events/stream');
    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === 'ORDER_STATUS_CHANGED' || event.type === 'ORDER_CREATED') {
          fetchCallingOrders();
          if (event.type === 'ORDER_STATUS_CHANGED' && event.data?.status === 'READY') {
            const ord = event.data;
            speakAnnouncement(ord.orderNumber, ord.servicePoint?.displayName || 'Pelanggan');
          }
        }
      } catch (err) {}
    };

    const interval = setInterval(fetchCallingOrders, 10000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, []);

  const speakAnnouncement = (orderNumber: string, location: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Pesanan nomor ${orderNumber.replace('#', '')}, lokasi ${location}, silakan mengambil pesanan.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCallOrder = (ord: any) => {
    speakAnnouncement(ord.orderNumber, ord.servicePointName);
  };

  const handleMarkPickedUp = (id: string) => {
    setReadyOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#0b1329', color: '#fff', textAlign: 'center' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '8px 20px', borderRadius: 9999, color: '#34d399', marginBottom: 12 }}>
          <Volume2 size={20} /> CALLING DISPLAY SYSTEM
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
          PESANAN SIAP AMBIL
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: 4 }}>Panggilan Pesanan Siap Disajikan • Bismillah Resto</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
        {readyOrders.map(ord => (
          <div key={ord.id} className="glass-card animate-pulse-glow" style={{ padding: 28, background: 'rgba(16, 185, 129, 0.08)', border: '2px solid #10b981' }}>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>NOMOR PESANAN</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#34d399', margin: '8px 0' }}>{ord.orderNumber}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>{ord.servicePointName}</div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleCallOrder(ord)} className="btn btn-primary" style={{ flex: 2, padding: '14px', fontSize: '1rem' }}>
                <Megaphone size={20} /> PANGGIL SUARA
              </button>
              <button onClick={() => handleMarkPickedUp(ord.id)} className="btn btn-secondary" style={{ flex: 1 }}>
                <CheckCircle2 size={18} /> SELESAI
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
