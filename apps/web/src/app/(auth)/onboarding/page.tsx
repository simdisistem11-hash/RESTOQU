'use client';

import React, { useState } from 'react';
import { ChefHat, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Building, Store, QrCode, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantOnboardingWizard() {
  const [step, setStep] = useState(1);

  // Form State
  const [restaurantName, setRestaurantName] = useState('Bismillah Resto');
  const [restaurantType, setRestaurantType] = useState('Restoran');
  const [outletName, setOutletName] = useState('Outlet Utama Sumenep');
  const [serviceType, setServiceType] = useState('Meja');
  const [tableCount, setTableCount] = useState(12);
  const [initialMenuName, setInitialMenuName] = useState('Nasi Goreng Spesial');
  const [initialMenuPrice, setInitialMenuPrice] = useState(28000);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleNextStep = () => {
    if (step < 8) {
      setStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
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
      paddingBottom: 40
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
          {step > 1 && !isCompleted && (
            <button onClick={handlePrevStep} style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <p style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 700 }}>ONBOARDING WIZARD</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Setup Restoran Baru</h1>
          </div>
        </div>

        {!isCompleted && (
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#247d68', background: '#dff3e9', padding: '4px 10px', borderRadius: 9999 }}>
            Langkah {step}/8
          </span>
        )}
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        {!isCompleted ? (
          <div style={{ background: '#ffffff', borderRadius: 28, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>1. Nama Restoran Anda</h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Masukkan nama restoran atau usaha F&B yang akan Anda daftarkan di RestoQu.</p>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={e => setRestaurantName(e.target.value)}
                  placeholder="Bismillah Resto"
                  style={{ width: '100%', padding: 14, borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>2. Kategori Usaha F&B</h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Pilih jenis bisnis F&B yang paling sesuai.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Restoran', 'Cafe / Coffee Shop', 'Food Court / Kedai', 'Rumah Makan / Fast Food'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setRestaurantType(cat)}
                      style={{
                        padding: 14, borderRadius: 14, border: restaurantType === cat ? '2px solid #247d68' : '1px solid #e5e7eb',
                        background: restaurantType === cat ? '#dff3e9' : '#f9fafb', color: restaurantType === cat ? '#247d68' : '#1d2925',
                        fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>3. Nama Outlet Pertama</h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Beri nama cabang/outlet pertama Anda.</p>
                <input
                  type="text"
                  value={outletName}
                  onChange={e => setOutletName(e.target.value)}
                  placeholder="Outlet Utama Sumenep"
                  style={{ width: '100%', padding: 14, borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                />
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>4. Tipe Service Point</h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Pilih istilah lokasi pemesanan untuk pelanggan Anda.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['Meja', 'Ruang VIP', 'Counter Kasir', 'Gazebo Area'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setServiceType(t)}
                      style={{
                        padding: 14, borderRadius: 14, border: serviceType === t ? '2px solid #247d68' : '1px solid #e5e7eb',
                        background: serviceType === t ? '#dff3e9' : '#f9fafb', color: serviceType === t ? '#247d68' : '#1d2925',
                        fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>5. Jumlah Service Point</h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Berapa banyak {serviceType} yang Anda miliki saat ini?</p>
                <input
                  type="number"
                  value={tableCount}
                  onChange={e => setTableCount(Number(e.target.value))}
                  style={{ width: '100%', padding: 14, borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', outline: 'none', color: '#247d68' }}
                />
              </div>
            )}

            {step === 6 && (
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>6. Menu Utama Pertama</h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Tambahkan 1 menu andalan restoran Anda.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    type="text"
                    value={initialMenuName}
                    onChange={e => setInitialMenuName(e.target.value)}
                    placeholder="Nama Makanan"
                    style={{ width: '100%', padding: 12, borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', outline: 'none' }}
                  />
                  <input
                    type="number"
                    value={initialMenuPrice}
                    onChange={e => setInitialMenuPrice(Number(e.target.value))}
                    placeholder="Harga (Rp)"
                    style={{ width: '100%', padding: 12, borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7eb', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>7. Otomasi QR Code</h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Sistem akan membuat {tableCount} QR Code unik secara otomatis untuk {restaurantName}.</p>
                <div style={{ padding: 16, background: '#dff3e9', borderRadius: 16, textAlign: 'center' }}>
                  <QrCode size={48} style={{ color: '#247d68', margin: '0 auto 8px' }} />
                  <p style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem' }}>Siap Membuat {tableCount} QR Code</p>
                  <p style={{ fontSize: '0.78rem', color: '#166534', marginTop: 2 }}>{serviceType} 01 sampai {serviceType} {tableCount < 10 ? `0${tableCount}` : tableCount}</p>
                </div>
              </div>
            )}

            {step === 8 && (
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>8. Konfirmasi & Siap Launching</h2>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>Periksa kembali data awal restoran Anda.</p>
                <div style={{ background: '#f9fafb', borderRadius: 16, padding: 14, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div><strong>Restoran:</strong> {restaurantName} ({restaurantType})</div>
                  <div><strong>Outlet:</strong> {outletName}</div>
                  <div><strong>Lokasi:</strong> {tableCount} {serviceType}</div>
                  <div><strong>Menu Awal:</strong> {initialMenuName} (Rp{initialMenuPrice.toLocaleString('id-ID')})</div>
                </div>
              </div>
            )}

            <button
              onClick={handleNextStep}
              style={{
                width: '100%', marginTop: 24, padding: 14, borderRadius: 16, background: '#247d68',
                color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(36, 125, 104, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              {step === 8 ? 'Selesaikan & Buat Restoran' : 'Lanjut ke Langkah Berikutnya'} <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: 28, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <CheckCircle2 size={56} style={{ color: '#247d68', margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6 }}>Selamat! Restoran Berhasil Dibuat</h2>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 24 }}>{tableCount} QR Code untuk {restaurantName} siap digunakan oleh pelanggan Anda.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/r/bismillah-resto/qr-bismillah-m01" style={{ padding: 14, borderRadius: 16, background: '#247d68', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Buka Tampilan Customer QR
              </Link>
              <Link href="/dashboard" style={{ padding: 14, borderRadius: 16, background: '#f3f4f6', color: '#1d2925', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Masuk ke Dashboard Owner
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
