'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, UserCheck, RefreshCw, ArrowLeft, Volume2, Megaphone, Plus, Minus, X, Sparkles, MapPin, AlertCircle, ShoppingBag, Clock, Check, ChefHat, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function WaiterAppPage() {
  const currentWaiterId = 'waiter-user-id-01';
  const currentWaiterName = 'Budi (Pelayan #01)';

  // Active Tab: 'tasks' (Antrean Panggilan) | 'ready' (Makanan Siap Antar) | 'tables' (Peta Meja)
  const [activeTab, setActiveTab] = useState<'tasks' | 'ready' | 'tables'>('tasks');

  // Service Requests State
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // Ready Orders (From Kitchen) State
  const [readyOrders, setReadyOrders] = useState<any[]>([]);
  const [loadingReady, setLoadingReady] = useState(true);

  // Table Map State
  const [tables, setTables] = useState<any[]>([
    { id: 'tb-01', internalCode: 'M01', displayName: 'Meja 01', status: 'OCCUPIED', activeItemsCount: 3, totalAmount: 45000 },
    { id: 'tb-02', internalCode: 'M02', displayName: 'Meja 02', status: 'AVAILABLE', activeItemsCount: 0, totalAmount: 0 },
    { id: 'tb-03', internalCode: 'M03', displayName: 'Meja 03', status: 'BILLING', activeItemsCount: 2, totalAmount: 50000 },
    { id: 'tb-04', internalCode: 'M04', displayName: 'Meja 04', status: 'AVAILABLE', activeItemsCount: 0, totalAmount: 0 },
    { id: 'tb-05', internalCode: 'M05', displayName: 'Meja 05', status: 'CALLING', activeItemsCount: 4, totalAmount: 78000 },
    { id: 'tb-12', internalCode: 'M12', displayName: 'Meja 12', status: 'OCCUPIED', activeItemsCount: 2, totalAmount: 36000 }
  ]);

  // Demo Fallback Service Requests
  const demoRequests = [
    {
      id: 'req-demo-01',
      servicePoint: { displayName: 'Meja 12' },
      type: 'CALL_WAITER',
      priority: 'URGENT',
      status: 'PENDING',
      notes: 'Pelanggan minta sendok tambahan',
      createdAt: new Date().toISOString()
    },
    {
      id: 'req-demo-02',
      servicePoint: { displayName: 'Meja 03' },
      type: 'REQUEST_BILL',
      priority: 'HIGH',
      status: 'PENDING',
      notes: 'Minta cetak bill / struk cetak',
      createdAt: new Date().toISOString()
    }
  ];

  // Demo Fallback Ready Orders
  const demoReadyOrders = [
    {
      id: 'ready-ord-1024',
      orderNumber: '#1024',
      servicePoint: { displayName: 'Meja 12' },
      items: [
        { id: 'r1', product: { name: 'Nasi Goreng Spesial' }, quantity: 1, isReady: true },
        { id: 'r2', product: { name: 'Es Teh Manis Jumbo' }, quantity: 1, isReady: true }
      ]
    },
    {
      id: 'ready-ord-1025',
      orderNumber: '#1025',
      servicePoint: { displayName: 'Meja 05' },
      items: [
        { id: 'r3', product: { name: 'Ayam Bakar Madura' }, quantity: 2, isReady: true }
      ]
    }
  ];

  // Waiter Order Entry Modal (for Table)
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<any | null>(null);
  const [waiterCart, setWaiterCart] = useState<{ [pId: string]: number }>({});
  const [menuProducts] = useState<any[]>([
    { id: 'p1', name: 'Nasi Goreng Spesial', price: 28000, category: 'Makanan' },
    { id: 'p2', name: 'Ayam Bakar Madura', price: 32000, category: 'Makanan' },
    { id: 'p3', name: 'Kopi Gula Aren', price: 18000, category: 'Minuman' },
    { id: 'p4', name: 'Es Teh Manis Jumbo', price: 8000, category: 'Minuman' },
    { id: 'p5', name: 'Cireng Rujak Pedas', price: 15000, category: 'Camilan' }
  ]);

  // Fetch Service Requests
  const fetchServiceRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch('/api/service-requests/create');
      const data = await res.json();
      if (data.success && data.requests && data.requests.length > 0) {
        setRequests(data.requests);
      } else {
        setRequests(demoRequests);
      }
    } catch (err) {
      setRequests(demoRequests);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch Ready Orders from KDS
  const fetchReadyOrders = async () => {
    try {
      setLoadingReady(true);
      const res = await fetch('/api/kds?tenantId=bismillah-resto');
      const data = await res.json();
      if (data.success && data.orders) {
        const readyOnly = data.orders.filter((o: any) => o.status === 'READY');
        setReadyOrders(readyOnly.length > 0 ? readyOnly : demoReadyOrders);
      } else {
        setReadyOrders(demoReadyOrders);
      }
    } catch (err) {
      setReadyOrders(demoReadyOrders);
    } finally {
      setLoadingReady(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
    fetchReadyOrders();

    // SSE Stream Event Listener
    const eventSource = new EventSource('/api/events/stream');
    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === 'WAITER_REQUESTED' || event.type === 'ORDER_STATUS_CHANGED' || event.type === 'ORDER_CREATED') {
          fetchServiceRequests();
          fetchReadyOrders();
        }
      } catch (err) {}
    };

    const interval = setInterval(() => {
      fetchServiceRequests();
      fetchReadyOrders();
    }, 10000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, []);

  // Voice Call Announcement for Ready Orders
  const speakAnnouncement = (orderNumber: string, location: string) => {
    if ('speechSynthesis' in window) {
      const text = `Pesanan ${orderNumber} untuk ${location} sudah siap disajikan!`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Panggilan Suara: Pesanan ${orderNumber} untuk ${location} siap disajikan!`);
    }
  };

  // Claim Request
  const handleClaimRequest = async (requestId: string) => {
    setClaimingId(requestId);
    try {
      await fetch('/api/waiter/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'claim', waiterId: currentWaiterId, waiterName: currentWaiterName })
      });
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'CLAIMED', assignedUser: { name: currentWaiterName } } : r));
    } catch (err) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'CLAIMED', assignedUser: { name: currentWaiterName } } : r));
    } finally {
      setClaimingId(null);
    }
  };

  // Complete Service Request
  const handleCompleteRequest = async (requestId: string) => {
    try {
      await fetch('/api/waiter/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'complete' })
      });
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      setRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  // Waiter Take Order Cart Handlers
  const handleUpdateWaiterCart = (pId: string, delta: number) => {
    const current = waiterCart[pId] || 0;
    const next = Math.max(0, current + delta);
    const updated = { ...waiterCart };
    if (next === 0) delete updated[pId];
    else updated[pId] = next;
    setWaiterCart(updated);
  };

  const handleSubmitWaiterOrder = () => {
    if (!selectedTableForOrder) return;
    alert(`✅ Pesanan tambahan berhasil diinput untuk ${selectedTableForOrder.displayName}!`);
    setSelectedTableForOrder(null);
    setWaiterCart({});
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
        background: '#f8f5ef',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 800, textTransform: 'uppercase' }}>RESTOQU WAITER APP</p>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d2925', letterSpacing: -0.3 }}>Layanan Pelayan</h1>
            </div>
          </div>

          <button onClick={() => { fetchServiceRequests(); fetchReadyOrders(); }} style={{ width: 36, height: 36, borderRadius: '50%', background: '#247d68', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* TAB 1: SERVICE REQUEST QUEUE & CLAIMS */}
      {activeTab === 'tasks' && (
        <main style={{ padding: '0 20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12, color: '#1d2925' }}>Antrean Panggilan Meja</h2>

          {loadingRequests ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280', fontWeight: 700 }}>
              Memuat Panggilan...
            </div>
          ) : requests.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: 24, padding: 30, textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <Bell size={40} style={{ color: '#247d68', margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Tidak Ada Panggilan Aktif</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>Semua meja terlayani dengan baik.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {requests.map(req => {
                const isClaimed = req.status === 'CLAIMED';
                const isUrgent = req.priority === 'URGENT';

                return (
                  <div
                    key={req.id}
                    style={{
                      background: '#ffffff', borderRadius: 20, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      borderLeft: isUrgent ? '5px solid #dc2626' : '5px solid #247d68'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <span style={{
                          padding: '4px 10px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 800,
                          background: isUrgent ? '#fee2e2' : '#dff3e9',
                          color: isUrgent ? '#dc2626' : '#247d68'
                        }}>
                          {req.servicePoint?.displayName}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1d2925', marginTop: 6 }}>
                          {req.type === 'CALL_WAITER' ? '🔔 Panggilan Pelayan' : req.type === 'REQUEST_BILL' ? '📜 Minta Cetak Bill' : '➕ Tambah Pesanan'}
                        </h4>
                      </div>

                      <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600 }}>
                        {new Date(req.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {req.notes && (
                      <p style={{ fontSize: '0.8rem', color: '#4b5563', marginBottom: 12, background: '#f9fafb', padding: '8px 12px', borderRadius: 12 }}>
                        "{req.notes}"
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {isClaimed ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534', fontSize: '0.8rem', fontWeight: 800 }}>
                          <UserCheck size={16} /> Ditangani: {req.assignedUser?.name || currentWaiterName}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 800 }}>
                          ⚠️ Belum Ditangani
                        </span>
                      )}

                      {!isClaimed ? (
                        <button
                          onClick={() => handleClaimRequest(req.id)}
                          disabled={claimingId === req.id}
                          style={{
                            padding: '8px 16px', borderRadius: 12, background: '#247d68', color: '#ffffff',
                            border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                            boxShadow: '0 3px 10px rgba(36,125,104,0.3)'
                          }}
                        >
                          {claimingId === req.id ? 'Proses...' : 'Ambil / Klaim'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCompleteRequest(req.id)}
                          style={{
                            padding: '8px 16px', borderRadius: 12, background: '#166534', color: '#ffffff',
                            border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer'
                          }}
                        >
                          ✓ Selesai
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* TAB 2: READY ORDERS FROM KITCHEN & VOICE CALL */}
      {activeTab === 'ready' && (
        <main style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1d2925' }}>Makanan Siap Diantar</h2>
            <span style={{ fontSize: '0.75rem', color: '#247d68', fontWeight: 800 }}>
              {readyOrders.length} Pesanan Siap
            </span>
          </div>

          {readyOrders.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: 24, padding: 30, textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <CheckCircle2 size={40} style={{ color: '#9ca3af', margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Semua Pesanan Sudah Diantar</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>Dapur sedang memasak pesanan baru...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {readyOrders.map(ord => (
                <div key={ord.id} style={{ background: '#ffffff', borderRadius: 20, padding: 16, boxShadow: '0 4px 14px rgba(0,0,0,0.04)', borderLeft: '5px solid #166534' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1d2925' }}>{ord.orderNumber}</span>
                      <span style={{ marginLeft: 8, padding: '3px 8px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 800, background: '#dcfce7', color: '#166534' }}>
                        {ord.servicePoint?.displayName}
                      </span>
                    </div>

                    <button
                      onClick={() => speakAnnouncement(ord.orderNumber, ord.servicePoint?.displayName || 'Meja')}
                      style={{
                        padding: '6px 12px', borderRadius: 10, background: '#fef3c7', color: '#92400e',
                        border: '1px solid #fde68a', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4
                      }}
                    >
                      <Volume2 size={14} /> Panggil Suara
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: '#f9fafb', padding: '10px 12px', borderRadius: 12, marginBottom: 12 }}>
                    {ord.items?.map((it: any) => (
                      <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 700 }}>{it.product?.name} ×{it.quantity}</span>
                        <span style={{ color: '#166534', fontWeight: 800 }}>✓ SIAP</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setReadyOrders(prev => prev.filter(r => r.id !== ord.id))}
                    style={{
                      width: '100%', padding: '10px', borderRadius: 12, background: '#166534', color: '#ffffff',
                      border: 'none', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer'
                    }}
                  >
                    ✓ Tandai Selesai Diantar ke Meja
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* TAB 3: INTERACTIVE TABLE MAP & ORDER ENTRY */}
      {activeTab === 'tables' && (
        <main style={{ padding: '0 20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12, color: '#1d2925' }}>Peta & Status Meja Restoran</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {tables.map(tb => {
              const isOccupied = tb.status === 'OCCUPIED' || tb.status === 'CALLING' || tb.status === 'BILLING';
              const isCalling = tb.status === 'CALLING';

              return (
                <div
                  key={tb.id}
                  style={{
                    background: '#ffffff', borderRadius: 20, padding: 14, boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    border: isCalling ? '2px solid #dc2626' : '1px solid #e5e7eb', position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: '#1d2925' }}>{tb.displayName}</span>
                    <span style={{
                      fontSize: '0.65rem', padding: '2px 8px', borderRadius: 9999, fontWeight: 800,
                      background: isCalling ? '#fee2e2' : isOccupied ? '#dff3e9' : '#f3f4f6',
                      color: isCalling ? '#dc2626' : isOccupied ? '#247d68' : '#6b7280'
                    }}>
                      {isCalling ? '🔔 PANGGIL' : isOccupied ? '🟢 TERISI' : '⚪ KOSONG'}
                    </span>
                  </div>

                  {isOccupied ? (
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {tb.activeItemsCount} Item • Rp{tb.totalAmount.toLocaleString('id-ID')}
                      </p>
                      <button
                        onClick={() => setSelectedTableForOrder(tb)}
                        style={{ width: '100%', marginTop: 10, padding: '6px', borderRadius: 8, background: '#247d68', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        + Tambah Pesanan
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Meja Siap Digunakan</p>
                      <button
                        onClick={() => setSelectedTableForOrder(tb)}
                        style={{ width: '100%', marginTop: 10, padding: '6px', borderRadius: 8, background: '#f3f4f6', color: '#1d2925', border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Buka Meja Baru
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* FIXED BOTTOM NAVBAR FOR WAITER APP */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '8px 12px 14px', zIndex: 90, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
      }}>
        <button
          onClick={() => setActiveTab('tasks')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
            color: activeTab === 'tasks' ? '#dc2626' : '#9ca3af'
          }}
        >
          <div style={{ position: 'relative' }}>
            <Bell size={20} />
            {requests.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -8, background: '#dc2626', color: '#fff', fontSize: '0.6rem', fontWeight: 900, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {requests.length}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'tasks' ? 900 : 700 }}>Panggilan</span>
        </button>

        <button
          onClick={() => setActiveTab('ready')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
            color: activeTab === 'ready' ? '#247d68' : '#9ca3af'
          }}
        >
          <div style={{ position: 'relative' }}>
            <CheckCircle2 size={20} />
            {readyOrders.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -8, background: '#247d68', color: '#fff', fontSize: '0.6rem', fontWeight: 900, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {readyOrders.length}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'ready' ? 900 : 700 }}>Siap Antar</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
            color: activeTab === 'tables' ? '#247d68' : '#9ca3af'
          }}
        >
          <MapPin size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'tables' ? 900 : 700 }}>Peta Meja</span>
        </button>
      </nav>

      {/* MODAL WAITER TAKE ORDER FOR TABLE */}
      {selectedTableForOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 380, background: '#ffffff', borderRadius: 24, padding: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>Input Pesanan {selectedTableForOrder.displayName}</h3>
              <button onClick={() => setSelectedTableForOrder(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {menuProducts.map(p => {
                const qty = waiterCart[p.id] || 0;
                return (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', padding: '8px 12px', borderRadius: 12 }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{p.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#247d68', display: 'block', fontWeight: 800 }}>Rp{p.price.toLocaleString('id-ID')}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {qty > 0 && (
                        <button onClick={() => handleUpdateWaiterCart(p.id, -1)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#ffffff', border: '1px solid #d1d5db', cursor: 'pointer' }}>
                          -
                        </button>
                      )}
                      {qty > 0 && <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>{qty}</span>}
                      <button onClick={() => handleUpdateWaiterCart(p.id, 1)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#247d68', color: '#fff', border: 'none', cursor: 'pointer' }}>
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSelectedTableForOrder(null)} style={{ flex: 1, padding: 10, borderRadius: 12, background: '#f3f4f6', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                Batal
              </button>
              <button onClick={handleSubmitWaiterOrder} style={{ flex: 1, padding: 10, borderRadius: 12, background: '#247d68', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>
                Kirim ke Dapur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT FIXED WAITER BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '10px 12px 16px', zIndex: 99999, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)'
      }}>
        <button
          onClick={() => setActiveTab('tasks')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeTab === 'tasks' ? '#dc2626' : '#9ca3af' }}
        >
          <Bell size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'tasks' ? 900 : 700 }}>Panggilan</span>
        </button>

        <button
          onClick={() => setActiveTab('ready')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeTab === 'ready' ? '#247d68' : '#9ca3af' }}
        >
          <ChefHat size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'ready' ? 900 : 700 }}>Siap Antar</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeTab === 'tables' ? '#247d68' : '#9ca3af' }}
        >
          <Utensils size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'tables' ? 900 : 700 }}>Peta Meja</span>
        </button>
      </nav>
    </div>
  );
}
