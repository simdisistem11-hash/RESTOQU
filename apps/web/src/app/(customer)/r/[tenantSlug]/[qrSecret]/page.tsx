'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingBag, Bell, Plus, Minus, CheckCircle, Clock, AlertCircle, X, ChevronRight, User, Phone, Sparkles, RefreshCw, Users, HelpCircle, QrCode, Utensils } from 'lucide-react';

export default function CustomerGroupSessionPage() {
  const params = useParams();
  const tenantSlug = params?.tenantSlug as string || 'bismillah-resto';
  const qrSecret = params?.qrSecret as string || 'qr-bismillah-m01';

  // Core State
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [servicePoint, setServicePoint] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [participant, setParticipant] = useState<any>(null);
  const [selectedOrderQr, setSelectedOrderQr] = useState<any | null>(null);

  // Menu State
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [products, setProducts] = useState<any[]>([]);

  // Personal Cart State: { [productId]: { quantity, notes } }
  const [personalCart, setPersonalCart] = useState<{ [key: string]: { quantity: number; notes: string } }>({});
  
  // Shared Session Synced State
  const [sharedCartSubtotal, setSharedCartSubtotal] = useState<number>(0);
  const [sharedTotalItems, setSharedTotalItems] = useState<number>(0);
  const [participantsCount, setParticipantsCount] = useState<number>(1);
  const [existingOrders, setExistingOrders] = useState<any[]>([]);

  // UI Modals & Drawers
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [guestNameInput, setGuestNameInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'orders' | 'service'>('menu');
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  // Main Customer Checkout Inputs
  const [mainCustomerName, setMainCustomerName] = useState<string>('');
  const [mainCustomerPhone, setMainCustomerPhone] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string>('');
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState<boolean>(false);

  // Service Request Feedback
  const [serviceSuccessMsg, setServiceSuccessMsg] = useState<string>('');

  // Active Promo Vouchers State
  const [vouchers, setVouchers] = useState<any[]>([]);

  const fetchActiveVouchers = async () => {
    try {
      const res = await fetch('/api/owner/loyalty/vouchers');
      const data = await res.json();
      if (data.success && data.vouchers) {
        setVouchers(data.vouchers);
      }
    } catch (e) {}
  };

  // 1. Initial Load: Get or Create Session
  const initSession = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/customer/session/get-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug, qrSecretKey: qrSecret })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Gagal memuat QR Meja');
        return;
      }

      setTenant(data.tenant);
      setServicePoint(data.servicePoint);
      setSession(data.session);

      // Check stored participant in LocalStorage
      const savedParticipantKey = `restoqu_participant_${data.session.id}`;
      const savedParticipant = localStorage.getItem(savedParticipantKey);

      if (savedParticipant) {
        const pObj = JSON.parse(savedParticipant);
        setParticipant(pObj);
      } else if (!data.isNewSession && data.session.participantsCount > 0) {
        // Active session exists with other participants -> Show Join Modal
        setShowJoinModal(true);
      } else {
        // Auto-join as Host
        await joinSession('Guest #1', data.session.id);
      }

      // Fetch Menu Categories & Products
      fetchMenuProducts(data.tenant.slug);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (name: string, overrideSessionId?: string) => {
    const targetSessionId = overrideSessionId || session?.id;
    if (!targetSessionId) return;

    try {
      const res = await fetch('/api/customer/session/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: targetSessionId, name })
      });

      const data = await res.json();
      if (res.ok && data.participant) {
        setParticipant(data.participant);
        localStorage.setItem(`restoqu_participant_${targetSessionId}`, JSON.stringify(data.participant));
        setShowJoinModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenuProducts = async (slug: string) => {
    try {
      const res = await fetch(`/api/customer/products?tenantSlug=${slug}`);
      const data = await res.json();

      if (res.ok && data.products && data.products.length > 0) {
        setCategories(data.categories);
        setProducts(data.products);
      } else {
        // Fallback demo menu if DB products are empty
        setCategories([
          { id: 'ALL', name: 'Semua Menu' },
          { id: 'FOOD', name: 'Makanan Utama' },
          { id: 'DRINK', name: 'Minuman' },
          { id: 'SNACK', name: 'Camilan' }
        ]);

        setProducts([
          { id: 'p1', name: 'Nasi Goreng Spesial', category: 'FOOD', price: 28000, description: 'Nasi goreng bumbu rempah dengan telur mata sapi dan kerupuk renyah.', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80' },
          { id: 'p2', name: 'Ayam Bakar Madura', category: 'FOOD', price: 32000, description: 'Ayam bakar bumbu kecap pedas manis khas Madura lengkap dengan sambal.', imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80' },
          { id: 'p3', name: 'Kopi Gula Aren', category: 'DRINK', price: 18000, description: 'Espresso arabika dengan susu segar UHT dan gula aren asli.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80' },
          { id: 'p4', name: 'Es Teh Manis Jumbo', category: 'DRINK', price: 8000, description: 'Es teh manis segar ukuran jumbo penyegar dahaga.', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80' },
          { id: 'p5', name: 'Cireng Rujak Pedas', category: 'SNACK', price: 15000, description: 'Cireng gurih renyah disajikan dengan bumbu rujak pedas manis.', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' }
        ]);
      }
    } catch (err) {
      console.error('Fetch menu error:', err);
    }
  };

  // 2. Realtime Sync Poller
  const syncSessionData = async () => {
    if (!session || !participant) return;

    try {
      const res = await fetch(`/api/customer/session/sync?sessionId=${session.id}&participantId=${participant.id}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setSharedCartSubtotal(data.sharedCart.subtotal);
        setSharedTotalItems(data.sharedCart.totalItemsCount);
        setParticipantsCount(data.session.participantsCount);
        setExistingOrders(data.existingOrders);

        if (data.session.status) {
          setSession((prev: any) => ({ ...prev, status: data.session.status }));
        }
      }
    } catch (err) {
      console.error('Sync error:', err);
    }
  };

  useEffect(() => {
    initSession();
    fetchActiveVouchers();
  }, []);

  useEffect(() => {
    if (session && participant) {
      syncSessionData();
      const interval = setInterval(syncSessionData, 3000);
      return () => clearInterval(interval);
    }
  }, [session?.id, participant?.id]);

  // Personal Cart Handlers - Instant UI Update
  const handleUpdateQuantity = async (product: any, delta: number) => {
    const currentQty = personalCart[product.id]?.quantity || 0;
    const newQty = Math.max(0, currentQty + delta);

    const updatedPersonalCart = { ...personalCart };
    if (newQty === 0) {
      delete updatedPersonalCart[product.id];
    } else {
      updatedPersonalCart[product.id] = {
        quantity: newQty,
        notes: personalCart[product.id]?.notes || ''
      };
    }

    // 1. Update Instant Local State
    setPersonalCart(updatedPersonalCart);

    // 2. Recalculate local item totals for instant UI feedback
    let localSubtotal = 0;
    let localItemsCount = 0;
    Object.entries(updatedPersonalCart).map(([pId, val]) => {
      const pr = products.find(p => p.id === pId);
      if (pr) {
        localSubtotal += pr.price * val.quantity;
        localItemsCount += val.quantity;
      }
    });

    setSharedCartSubtotal(localSubtotal);
    setSharedTotalItems(localItemsCount);

    // 3. Sync to backend DB if participant exists
    if (participant) {
      const cartItemsArray = Object.entries(updatedPersonalCart).map(([productId, val]) => ({
        productId,
        quantity: val.quantity,
        notes: val.notes
      }));

      try {
        await fetch('/api/customer/cart/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participantId: participant.id, items: cartItemsArray })
        });
        syncSessionData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Main Customer Checkout Submit
  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!mainCustomerName.trim()) {
      setCheckoutError('Nama Pemesan Utama wajib diisi');
      return;
    }

    if (!mainCustomerPhone.trim() || mainCustomerPhone.trim().length < 9) {
      setCheckoutError('Nomor WhatsApp wajib diisi (minimal 9 digit)');
      return;
    }

    try {
      setIsSubmittingCheckout(true);
      const clientCartItemsArray = Object.entries(personalCart).map(([productId, val]) => ({
        productId,
        quantity: val.quantity,
        notes: val.notes
      }));

      const res = await fetch('/api/customer/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          participantId: participant?.id || 'demo-participant-id',
          mainCustomerName,
          mainCustomerPhone,
          items: clientCartItemsArray
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || 'Gagal memproses checkout');
        return;
      }

      // Success Order Created!
      setPersonalCart({});
      setShowCheckoutModal(false);
      setActiveTab('orders');
      syncSessionData();

    } catch (err) {
      setCheckoutError('Terjadi kesalahan koneksi');
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  const handleSendServiceRequest = async (type: string) => {
    setServiceSuccessMsg(`✅ Permintaan "${type}" telah terkirim ke Pelayan!`);
    setTimeout(() => setServiceSuccessMsg(''), 4000);
  };

  // Compute Personal Cart Totals
  const personalSubtotal = Object.entries(personalCart).reduce((sum, [pId, val]) => {
    const p = products.find(prod => prod.id === pId);
    return sum + (p ? p.price * val.quantity : 0);
  }, 0);

  const personalItemCount = Object.values(personalCart).reduce((sum, val) => sum + val.quantity, 0);

  const filteredProducts = selectedCategory === 'ALL' ? products : products.filter(p => p.category === selectedCategory || p.categoryId === selectedCategory);

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#f8f5ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#247d68', fontWeight: 700 }}>
        Memuat RestoQu QR Menu...
      </div>
    );
  }

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
        background: '#f8f5ef',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d2925', letterSpacing: -0.4 }}>
              {tenant?.name || 'Bismillah Resto'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ padding: '2px 10px', borderRadius: 9999, background: '#247d68', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800 }}>
                {servicePoint?.displayName || 'Meja 12'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={12} style={{ color: '#247d68' }} /> {participantsCount} orang di meja ini
              </span>
            </div>
          </div>

          <button onClick={syncSessionData} style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#247d68', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Main View Tabs */}
      {activeTab === 'menu' && (
        <main style={{ padding: '0 20px' }}>
          {/* Active Promo Vouchers Carousel */}
          {vouchers && vouchers.length > 0 && (
            <div style={{ marginBottom: 14, overflowX: 'auto', display: 'flex', gap: 10, paddingBottom: 4 }}>
              {vouchers.map(v => (
                <div
                  key={v.id}
                  style={{
                    minWidth: 210,
                    background: 'linear-gradient(135deg, #f7eadc 0%, #fef3c7 100%)',
                    borderRadius: 16,
                    padding: '10px 14px',
                    border: '1px solid #fde68a',
                    flexShrink: 0
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#247d68', letterSpacing: 0.5 }}>{v.code}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: '#ffffff', color: '#b45309' }}>
                      {v.discountType === 'PERCENT' ? `${v.discountValue}% OFF` : `Hemat Rp${Math.round(v.discountValue / 1000)}k`}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d2925', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.title}
                  </p>
                  <p style={{ fontSize: '0.62rem', color: '#6b7280', marginTop: 2 }}>
                    Min. belanja Rp{v.minSpend?.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 14 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 16px', borderRadius: 9999, border: 'none', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer',
                  background: selectedCategory === cat.id ? '#247d68' : '#ffffff',
                  color: selectedCategory === cat.id ? '#ffffff' : '#4b5563',
                  boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(36,125,104,0.3)' : '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 2-Column Product Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {filteredProducts.map(p => {
              const qty = personalCart[p.id]?.quantity || 0;
              return (
                <div key={p.id} style={{ background: '#ffffff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                  <div style={{ padding: 12 }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1d2925', lineHeight: 1.2 }}>{p.name}</h3>
                    <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: 4, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#247d68' }}>
                        Rp{p.price.toLocaleString('id-ID')}
                      </span>

                      {qty === 0 ? (
                        <button
                          onClick={() => handleUpdateQuantity(p, 1)}
                          style={{ width: 32, height: 32, borderRadius: '50%', background: '#247d68', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 3px 8px rgba(36,125,104,0.3)' }}
                        >
                          <Plus size={16} />
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dff3e9', borderRadius: 9999, padding: '2px 6px' }}>
                          <button onClick={() => handleUpdateQuantity(p, -1)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', border: 'none', color: '#247d68', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#247d68' }}>{qty}</span>
                          <button onClick={() => handleUpdateQuantity(p, 1)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#247d68', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Plus size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {activeTab === 'cart' && (
        <main style={{ padding: '0 20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14 }}>Keranjang Pesanan</h2>

          {/* Personal Cart Items */}
          <div style={{ background: '#ffffff', borderRadius: 24, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)', marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#247d68', marginBottom: 12 }}>
              Pesanan Saya ({participant?.name || 'Guest'})
            </h3>

            {personalItemCount === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>Keranjang Anda masih kosong.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(personalCart).map(([pId, val]) => {
                  const prod = products.find(p => p.id === pId);
                  if (!prod) return null;
                  return (
                    <div key={pId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #f3f4f6', paddingBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{prod.name}</span>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Rp{prod.price.toLocaleString('id-ID')} × {val.quantity}</p>
                      </div>
                      <span style={{ fontWeight: 800, color: '#247d68' }}>
                        Rp{(prod.price * val.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shared Session Aggregated Total Summary */}
          <div style={{ background: '#linear-gradient(135deg, #dff3e9 0%, #ffffff 100%)', borderRadius: 24, padding: 18, border: '2px solid #247d68', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase' }}>RINGKASAN MEJA SEKALIGUS</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#247d68', color: '#fff', padding: '2px 8px', borderRadius: 9999 }}>
                {participantsCount} Peserta
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 900, color: '#1d2925' }}>
              <span>Total Estimasi Meja</span>
              <span style={{ color: '#247d68' }}>Rp{sharedCartSubtotal.toLocaleString('id-ID')}</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 4 }}>Seluruh cart peserta akan digabung menjadi 1 Main Order saat checkout.</p>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            disabled={sharedCartSubtotal === 0}
            style={{
              width: '100%', padding: 14, borderRadius: 16, background: sharedCartSubtotal > 0 ? '#247d68' : '#d1d5db',
              color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: sharedCartSubtotal > 0 ? 'pointer' : 'not-allowed',
              boxShadow: sharedCartSubtotal > 0 ? '0 4px 14px rgba(36,125,104,0.3)' : 'none'
            }}
          >
            Proses Checkout (Pesan Sekarang)
          </button>
        </main>
      )}

      {activeTab === 'orders' && (
        <main style={{ padding: '0 20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14 }}>Status Pesanan Meja</h2>

          {existingOrders.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: 24, padding: 30, textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <Clock size={40} style={{ color: '#9ca3af', margin: '0 auto 10px' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4b5563' }}>Belum ada pesanan terkonfirmasi di meja ini.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {existingOrders.map(ord => (
                <div key={ord.id} style={{ background: '#ffffff', borderRadius: 24, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: 800 }}>{ord.orderNumber}</span>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Atas Nama: <strong>{ord.mainCustomerName}</strong></p>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 800,
                      background: ord.status === 'READY' ? '#dcfce7' : ord.status === 'COOKING' ? '#fef3c7' : '#e0f2fe',
                      color: ord.status === 'READY' ? '#166534' : ord.status === 'COOKING' ? '#92400e' : '#075985'
                    }}>
                      {ord.status === 'READY' ? '🟢 Siap Disajikan' : ord.status === 'COOKING' ? '🔥 Sedang Dimasak' : '🟡 Diterima'}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {ord.items?.map((it: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                        <span>{it.name} × {it.quantity}</span>
                        <span style={{ fontWeight: 700 }}>Rp{it.totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                    <span>Total Pembayaran</span>
                    <span style={{ color: '#247d68' }}>Rp{ord.totalAmount.toLocaleString('id-ID')}</span>
                  </div>

                  <button
                    onClick={() => setSelectedOrderQr(ord)}
                    style={{
                      width: '100%', marginTop: 12, padding: 10, borderRadius: 14,
                      background: '#dff3e9', color: '#247d68', border: '1px solid #247d68',
                      fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <QrCode size={16} /> Tunjukkan QR Pesanan ke Kasir
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === 'service' && (
        <main style={{ padding: '0 20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14 }}>Layanan Pelayan (Waiter)</h2>

          {serviceSuccessMsg && (
            <div style={{ padding: 14, background: '#dcfce7', color: '#166534', borderRadius: 16, marginBottom: 16, fontSize: '0.85rem', fontWeight: 700 }}>
              {serviceSuccessMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => handleSendServiceRequest('Panggil Pelayan')}
              style={{ padding: 16, borderRadius: 20, background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1d2925' }}>Panggil Pelayan ke Meja</h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Minta bantuan pelayan datang ke {servicePoint?.displayName || 'Meja 12'}</p>
              </div>
            </button>

            <button
              onClick={() => handleSendServiceRequest('Minta Bill Pembayaran')}
              style={{ padding: 16, borderRadius: 20, background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1d2925' }}>Minta Struk / Bill Pembayaran</h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Minta kasir menyiapkan rincian pembayaran</p>
              </div>
            </button>
          </div>
        </main>
      )}

      {/* Floating Bottom Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: '#173f35',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
      }}>
        <button onClick={() => setActiveTab('menu')} style={{ background: 'transparent', border: 'none', color: activeTab === 'menu' ? '#ffffff' : '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
          <Sparkles size={20} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Menu</span>
        </button>

        <button onClick={() => setActiveTab('cart')} style={{ background: 'transparent', border: 'none', color: activeTab === 'cart' ? '#ffffff' : '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', position: 'relative' }}>
          <ShoppingBag size={20} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Keranjang</span>
          {sharedTotalItems > 0 && (
            <span style={{ position: 'absolute', top: -4, right: 6, background: '#dc2626', color: '#fff', fontSize: '0.65rem', fontWeight: 800, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {sharedTotalItems}
            </span>
          )}
        </button>

        <button onClick={() => setActiveTab('orders')} style={{ background: 'transparent', border: 'none', color: activeTab === 'orders' ? '#ffffff' : '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
          <Clock size={20} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Pesanan</span>
        </button>

        <button onClick={() => setActiveTab('service')} style={{ background: 'transparent', border: 'none', color: activeTab === 'service' ? '#ffffff' : '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
          <Bell size={20} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Pelayan</span>
        </button>
      </nav>

      {/* JOIN SESSION MODAL */}
      {showJoinModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: '#ffffff', borderRadius: '28px 28px 0 0', padding: 24, boxShadow: '0 -10px 30px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 6 }}>{servicePoint?.displayName || 'Meja 12'} Sedang Digunakan</h3>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Gabung ke pesanan meja ini bersama teman-teman Anda?</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Nama Anda (Opsional)</label>
              <input
                type="text"
                value={guestNameInput}
                onChange={e => setGuestNameInput(e.target.value)}
                placeholder="Misal: Andi / Budi"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', outline: 'none', fontWeight: 600 }}
              />
            </div>

            <button
              onClick={() => joinSession(guestNameInput || 'Guest')}
              style={{ width: '100%', padding: 14, borderRadius: 16, background: '#247d68', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}
            >
              [ Gabung Pesanan Meja Ini ]
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT MAIN CUSTOMER MODAL */}
      {showCheckoutModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: '#ffffff', borderRadius: '28px 28px 0 0', padding: 24, boxShadow: '0 -10px 30px rgba(0,0,0,0.15)', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Data Pemesan Utama</h3>
              <button onClick={() => setShowCheckoutModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {checkoutError && (
              <div style={{ padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 14, marginBottom: 14, fontSize: '0.82rem', fontWeight: 700 }}>
                ⚠️ {checkoutError}
              </div>
            )}

            <form onSubmit={handleConfirmCheckout}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Nama Pemesan Utama *</label>
                <input
                  type="text"
                  value={mainCustomerName}
                  onChange={e => setMainCustomerName(e.target.value)}
                  placeholder="Misal: Budi"
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4 }}>Nomor WhatsApp *</label>
                <input
                  type="tel"
                  value={mainCustomerPhone}
                  onChange={e => setMainCustomerPhone(e.target.value)}
                  placeholder="081234567890"
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                />
              </div>

              {/* Order Summary Breakdown */}
              <div style={{ background: '#f9fafb', borderRadius: 18, padding: 14, marginBottom: 20, fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Service Point:</span>
                  <strong style={{ color: '#247d68' }}>{servicePoint?.displayName || 'Meja 12'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Jumlah Peserta:</span>
                  <strong>{participantsCount} Orang</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 900, marginTop: 8, borderTop: '1px dashed #d1d5db', paddingTop: 8 }}>
                  <span>Total Tagihan</span>
                  <span style={{ color: '#247d68' }}>Rp{sharedCartSubtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingCheckout}
                style={{
                  width: '100%', padding: 14, borderRadius: 16, background: '#247d68', color: '#fff', border: 'none',
                  fontWeight: 800, fontSize: '0.95rem', cursor: isSubmittingCheckout ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(36,125,104,0.3)'
                }}
              >
                {isSubmittingCheckout ? 'Memproses Order...' : '[ Konfirmasi & Pesan Sekarang ]'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN ORDER QR CODE MODAL FOR CASHIER TRANSACTIONS */}
      {selectedOrderQr && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#ffffff', borderRadius: 28, padding: 24, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
            <button
              onClick={() => setSelectedOrderQr(null)}
              style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <span style={{ padding: '4px 12px', borderRadius: 9999, background: '#dff3e9', color: '#247d68', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
              QR TRANSAKSI KASIR
            </span>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: 8, marginBottom: 2 }}>
              {selectedOrderQr.orderNumber}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 16 }}>
              {servicePoint?.displayName || 'Meja 12'} • Atas Nama: <strong>{selectedOrderQr.mainCustomerName}</strong>
            </p>

            <div style={{ background: '#f9fafb', padding: 16, borderRadius: 20, border: '2px solid #247d68', display: 'inline-block', marginBottom: 16 }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(selectedOrderQr.orderNumber)}`}
                alt={`QR Code ${selectedOrderQr.orderNumber}`}
                style={{ width: 220, height: 220, borderRadius: 12 }}
              />
            </div>

            <div style={{ background: '#f0fdf4', padding: 10, borderRadius: 14, border: '1px solid #bbf7d0', fontSize: '0.78rem', color: '#166534', fontWeight: 700, marginBottom: 16 }}>
              💡 Tunjukkan Kode QR ini kepada Kasir untuk langsung memroses pembayaran Anda.
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 900, borderTop: '1px dashed #e5e7eb', paddingTop: 12 }}>
              <span>Total Tagihan:</span>
              <span style={{ color: '#247d68' }}>Rp{selectedOrderQr.totalAmount?.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      )}
      {/* PERMANENT FIXED CUSTOMER BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '10px 12px 16px', zIndex: 99999, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)'
      }}>
        <button
          onClick={() => setActiveTab('menu')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeTab === 'menu' ? '#247d68' : '#9ca3af' }}
        >
          <Utensils size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'menu' ? 900 : 700 }}>Katalog</span>
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeTab === 'cart' ? '#247d68' : '#9ca3af' }}
        >
          <div style={{ position: 'relative' }}>
            <ShoppingBag size={20} />
            {sharedTotalItems > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -8, background: '#247d68', color: '#fff', fontSize: '0.6rem', fontWeight: 900, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {sharedTotalItems}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'cart' ? 900 : 700 }}>Pesanan Saya</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeTab === 'orders' ? '#247d68' : '#9ca3af' }}
        >
          <div style={{ position: 'relative' }}>
            <Clock size={20} />
            {existingOrders.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -8, background: '#d97706', color: '#fff', fontSize: '0.6rem', fontWeight: 900, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {existingOrders.length}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'orders' ? 900 : 700 }}>Struk Meja</span>
        </button>

        <button
          onClick={() => setActiveTab('service')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeTab === 'service' ? '#dc2626' : '#9ca3af' }}
        >
          <Bell size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'service' ? 900 : 700 }}>Panggil Waiter</span>
        </button>
      </nav>
    </div>
  );
}
