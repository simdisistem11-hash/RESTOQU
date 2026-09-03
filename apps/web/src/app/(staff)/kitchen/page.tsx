'use client';

import React, { useEffect, useState } from 'react';
import { ChefHat, Flame, CheckCircle2, Clock, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function KitchenKDSMobilePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kitchenTab, setKitchenTab] = useState<'all' | 'cooking' | 'ready'>('all');

  const fetchKDSOrders = async () => {
    try {
      const res = await fetch('/api/kds?tenantId=bismillah-resto');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKDSOrders();
    
    // Connect SSE Stream for Instant Realtime Updates
    const eventSource = new EventSource('/api/events/stream');
    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === 'ORDER_CREATED' || event.type === 'ORDER_STATUS_CHANGED') {
          fetchKDSOrders();
        }
      } catch (err) {}
    };

    // Backup polling fallback (every 10s)
    const interval = setInterval(fetchKDSOrders, 10000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/kds/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus })
      });
      if (res.ok) {
        fetchKDSOrders();
      }
    } catch (err) {
      alert('Gagal memperbarui status');
    }
  };

  const filteredOrders = kitchenTab === 'all'
    ? orders
    : kitchenTab === 'cooking'
    ? orders.filter(o => o.status === 'NEW' || o.status === 'COOKING')
    : orders.filter(o => o.status === 'READY');

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
            <p style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>ROLE: DAPUR (KDS)</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Layar Dapur Realtime</h1>
          </div>
        </div>

        <button onClick={fetchKDSOrders} style={{ width: 36, height: 36, borderRadius: '50%', background: '#247d68', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}>
          <RefreshCw size={16} />
        </button>
      </header>

      {/* KDS Mobile Content */}
      <main style={{ padding: '0 20px' }}>
        {loading ? (
          <div style={{ color: '#6b7280', padding: 40, textAlign: 'center', fontWeight: 600 }}>Memuat pesanan dapur...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: '#ffffff', borderRadius: 24, boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 12px', color: '#247d68' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Semua Pesanan Dapur Selesai!</h2>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>Tidak ada tiket pesanan aktif saat ini.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredOrders.map(order => {
              const isCooking = order.status === 'COOKING';
              const isReady = order.status === 'READY';

              return (
                <div
                  key={order.id}
                  style={{
                    background: '#ffffff', borderRadius: 24, boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    borderLeft: `6px solid ${isReady ? '#247d68' : isCooking ? '#d97706' : '#0284c7'}`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{order.orderNumber}</span>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: 8 }}>{order.servicePoint?.displayName}</span>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700,
                        background: isReady ? '#dcfce7' : isCooking ? '#fef3c7' : '#e0f2fe',
                        color: isReady ? '#166534' : isCooking ? '#92400e' : '#075985'
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #f3f4f6', paddingTop: 10 }}>
                      {order.items?.map((item: any) => (
                        <div key={item.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem' }}>
                            <span>{item.product?.name}</span>
                            <span style={{ color: '#247d68', fontSize: '1rem' }}>× {item.quantity}</span>
                          </div>
                          {item.modifiers?.length > 0 && (
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', paddingLeft: 6 }}>
                              {item.modifiers.map((m: any) => m.modifier?.name).join(', ')}
                            </div>
                          )}
                          {item.notes && (
                            <div style={{ fontSize: '0.75rem', color: '#d97706', fontStyle: 'italic', paddingLeft: 6 }}>
                              Ket: {item.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: 12, borderTop: '1px solid #f3f4f6', background: '#f9fafb' }}>
                    {order.status === 'NEW' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'COOKING')} style={{ width: '100%', padding: 12, borderRadius: 14, background: '#d97706', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Flame size={16} /> MULAI MASAK
                      </button>
                    )}
                    {order.status === 'COOKING' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'READY')} style={{ width: '100%', padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <CheckCircle2 size={16} /> SIAP DISAJIKAN (READY)
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'PICKED_UP')} style={{ width: '100%', padding: 12, borderRadius: 14, background: '#e5e7eb', color: '#4b5563', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                        PANGGIL / DIPROSES
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* PERMANENT FIXED KITCHEN BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '10px 12px 16px', zIndex: 99999, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)'
      }}>
        <button
          onClick={() => setKitchenTab('all')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: kitchenTab === 'all' ? '#d97706' : '#9ca3af' }}
        >
          <Flame size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: kitchenTab === 'all' ? 900 : 700 }}>Semua Order</span>
        </button>

        <button
          onClick={() => setKitchenTab('cooking')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: kitchenTab === 'cooking' ? '#d97706' : '#9ca3af' }}
        >
          <ChefHat size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: kitchenTab === 'cooking' ? 900 : 700 }}>Sedang Masak</span>
        </button>

        <button
          onClick={() => setKitchenTab('ready')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: kitchenTab === 'ready' ? '#247d68' : '#9ca3af' }}
        >
          <CheckCircle2 size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: kitchenTab === 'ready' ? 900 : 700 }}>Makanan Siap</span>
        </button>
      </nav>
    </div>
  );
}
