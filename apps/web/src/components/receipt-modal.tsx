'use client';

import React from 'react';
import { Printer, X, CheckCircle2, MessageSquare, Utensils } from 'lucide-react';
import { ReceiptData, printReceiptViaBrowser, printKitchenTicketViaBrowser, formatRupiah } from '@/lib/printer';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  rawOrder?: any;
}

export function ReceiptModal({ isOpen, onClose, receiptData, rawOrder }: ReceiptModalProps) {
  if (!isOpen || !receiptData) return null;

  const handleSendWhatsApp = async () => {
    if (!receiptData.mainCustomerPhone) {
      alert('Nomor WhatsApp pelanggan tidak tersedia');
      return;
    }

    try {
      const res = await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: receiptData.mainCustomerPhone,
          receipt: receiptData
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Struk digital berhasil dikirim via WhatsApp!');
      } else {
        alert(data.error || 'Gagal mengirim WhatsApp');
      }
    } catch (err) {
      alert('Gagal terhubung ke service WhatsApp');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)',
      padding: 16
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: '#1d2925',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={20} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Struk Pembayaran Lunas</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Receipt Thermal Preview */}
        <div style={{
          padding: 20,
          overflowY: 'auto',
          background: '#f8fafc',
          flex: 1,
          fontFamily: 'monospace',
          fontSize: '0.85rem'
        }}>
          <div style={{
            background: '#ffffff',
            padding: 16,
            borderRadius: 12,
            border: '1px dashed #cbd5e1',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}>{receiptData.header || 'RESTOQU'}</div>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>Struk Pembayaran Resmi</div>
            <hr style={{ border: 'none', borderTop: '1px dashed #94a3b8', margin: '12px 0' }} />

            <div>Order #: <strong>{receiptData.orderNumber}</strong></div>
            <div>Waktu  : {receiptData.date}</div>
            <div>Meja   : {receiptData.servicePointName}</div>
            <div>Customer: {receiptData.mainCustomerName || 'Pelanggan'}</div>
            <hr style={{ border: 'none', borderTop: '1px dashed #94a3b8', margin: '12px 0' }} />

            {receiptData.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>+ {item.modifiers.join(', ')}</div>
                  )}
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.quantity} x {formatRupiah(item.unitPrice)}</div>
                </div>
                <div style={{ fontWeight: 700 }}>{formatRupiah(item.totalPrice)}</div>
              </div>
            ))}

            <hr style={{ border: 'none', borderTop: '1px dashed #94a3b8', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>{formatRupiah(receiptData.subtotal)}</span>
            </div>
            {receiptData.serviceAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Service Charge</span>
                <span>{formatRupiah(receiptData.serviceAmount)}</span>
              </div>
            )}
            {receiptData.taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Pajak (PB1)</span>
                <span>{formatRupiah(receiptData.taxAmount)}</span>
              </div>
            )}
            {receiptData.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                <span>Diskon</span>
                <span>-{formatRupiah(receiptData.discountAmount)}</span>
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '2px solid #000', margin: '8px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem' }}>
              <span>TOTAL</span>
              <span>{formatRupiah(receiptData.totalAmount)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span>Metode Bayar</span>
              <span>{receiptData.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dibayar</span>
              <span>{formatRupiah(receiptData.amountPaid)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Kembali</span>
              <span>{formatRupiah(receiptData.change)}</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{ padding: 16, background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => printReceiptViaBrowser(receiptData)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 12,
              background: '#247d68',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            <Printer size={18} /> Cetak Struk (Thermal 80mm/58mm)
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={() => printKitchenTicketViaBrowser(rawOrder || receiptData)}
              style={{
                padding: '10px',
                borderRadius: 10,
                background: '#f1f5f9',
                color: '#1e293b',
                border: '1px solid #cbd5e1',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <Utensils size={16} /> Ticket Dapur
            </button>

            <button
              onClick={handleSendWhatsApp}
              style={{
                padding: '10px',
                borderRadius: 10,
                background: '#25D366',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <MessageSquare size={16} /> Kirim WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
