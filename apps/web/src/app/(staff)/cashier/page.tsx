'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard, DollarSign, QrCode, Printer, CheckCircle, RefreshCw, ArrowLeft,
  Search, Plus, Minus, ShoppingBag, X, Sparkles, Send, Gift, Tag, UserCheck,
  Calendar, History, TrendingUp, Receipt, Clock, Filter, Lock, Unlock, ShieldCheck,
  AlertTriangle, Check, Wallet, User, Ticket
} from 'lucide-react';
import Link from 'next/link';
import { ReceiptModal } from '@/components/receipt-modal';

export default function CashierPOSPage() {
  // Mode: 'orders' (Tagihan Meja) | 'direct' (Direct POS) | 'history' (Riwayat Transaksi)
  const [activeMode, setActiveMode] = useState<'orders' | 'direct' | 'history'>('orders');

  // Orders State (Unpaid Table Bills)
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo fallback unpaid orders
  const demoOrders = [
    {
      id: 'demo-ord-1024',
      orderNumber: 'Order #1024',
      mainCustomerName: 'Andi Pratama',
      mainCustomerPhone: '081234567890',
      servicePoint: { displayName: 'Meja 12' },
      subtotal: 36000,
      totalAmount: 36000,
      items: [
        { id: 'it1', product: { name: 'Nasi Goreng Spesial' }, quantity: 1, totalPrice: 28000 },
        { id: 'it2', product: { name: 'Es Teh Manis Jumbo' }, quantity: 1, totalPrice: 8000 }
      ]
    },
    {
      id: 'demo-ord-1025',
      orderNumber: 'Order #1025',
      mainCustomerName: 'Siti Rahma',
      mainCustomerPhone: '085712345678',
      servicePoint: { displayName: 'Meja 03' },
      subtotal: 50000,
      totalAmount: 50000,
      items: [
        { id: 'it3', product: { name: 'Ayam Bakar Madura' }, quantity: 1, totalPrice: 32000 },
        { id: 'it4', product: { name: 'Kopi Gula Aren' }, quantity: 1, totalPrice: 18000 }
      ]
    }
  ];

  // Menu & Direct POS Cart State
  const [categories, setCategories] = useState<any[]>([
    { id: 'ALL', name: 'Semua' },
    { id: 'FOOD', name: 'Makanan' },
    { id: 'DRINK', name: 'Minuman' },
    { id: 'SNACK', name: 'Camilan' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [products, setProducts] = useState<any[]>([
    { id: 'p1', name: 'Nasi Goreng Spesial', category: 'FOOD', price: 28000, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80' },
    { id: 'p2', name: 'Ayam Bakar Madura', category: 'FOOD', price: 32000, imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80' },
    { id: 'p3', name: 'Kopi Gula Aren', category: 'DRINK', price: 18000, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80' },
    { id: 'p4', name: 'Es Teh Manis Jumbo', category: 'DRINK', price: 8000, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80' },
    { id: 'p5', name: 'Cireng Rujak Pedas', category: 'SNACK', price: 15000, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' }
  ]);
  const [directCart, setDirectCart] = useState<{ [pId: string]: number }>({});
  const [directCustomerName, setDirectCustomerName] = useState('Takeaway Customer');
  const [directCustomerPhone, setDirectCustomerPhone] = useState('');

  // Shift Management State
  const [activeShift, setActiveShift] = useState<any | null>({
    id: 'shift-demo-1',
    cashierName: 'Ahmad - Kasir 01',
    startTime: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'OPEN',
    startingCash: 200000
  });
  const [showOpenShiftModal, setShowOpenShiftModal] = useState<boolean>(false);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState<boolean>(false);
  const [openShiftCashierName, setOpenShiftCashierName] = useState<string>('Ahmad - Kasir 01');
  const [startingCashInput, setStartingCashInput] = useState<number>(200000);
  const [actualEndingCashInput, setActualEndingCashInput] = useState<number>(0);
  const [shiftNotesInput, setShiftNotesInput] = useState<string>('');
  const [shiftReportData, setShiftReportData] = useState<any | null>(null);

  // History State & Filters
  const getTodayStr = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  const [startDate, setStartDate] = useState<string>(getTodayStr());
  const [endDate, setEndDate] = useState<string>(getTodayStr());
  const [historyPaymentMethod, setHistoryPaymentMethod] = useState<string>('ALL');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historySummary, setHistorySummary] = useState<{ totalRevenue: number; totalTransactions: number; averageTransaction: number }>({
    totalRevenue: 0,
    totalTransactions: 0,
    averageTransaction: 0
  });

  // Demo Fallback History Orders
  const demoHistoryOrders = [
    {
      id: 'demo-hist-1021',
      orderNumber: 'Order #1021',
      createdAt: new Date().toISOString(),
      mainCustomerName: 'Budi Santoso',
      mainCustomerPhone: '081298765432',
      servicePoint: { displayName: 'Meja 05' },
      paymentStatus: 'PAID',
      subtotal: 78000,
      discountAmount: 8000,
      totalAmount: 70000,
      payments: [{ method: 'QRIS', amount: 70000 }],
      items: [
        { id: 'h1', product: { name: 'Nasi Goreng Spesial' }, quantity: 2, totalPrice: 56000 },
        { id: 'h2', product: { name: 'Kopi Gula Aren' }, quantity: 1, totalPrice: 18000 },
        { id: 'h3', product: { name: 'Es Teh Manis Jumbo' }, quantity: 1, totalPrice: 8000 }
      ]
    },
    {
      id: 'demo-hist-1022',
      orderNumber: 'Order #1022',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      mainCustomerName: 'Dewi Lestari',
      mainCustomerPhone: '085211223344',
      servicePoint: { displayName: 'Meja 08' },
      paymentStatus: 'PAID',
      subtotal: 47000,
      discountAmount: 0,
      totalAmount: 47000,
      payments: [{ method: 'CASH', amount: 50000 }],
      items: [
        { id: 'h4', product: { name: 'Ayam Bakar Madura' }, quantity: 1, totalPrice: 32000 },
        { id: 'h5', product: { name: 'Cireng Rujak Pedas' }, quantity: 1, totalPrice: 15000 }
      ]
    },
    {
      id: 'demo-hist-1023',
      orderNumber: 'Order #1023',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      mainCustomerName: 'Rian Hidayat',
      mainCustomerPhone: '087799887766',
      servicePoint: { displayName: 'Kasir Direct' },
      paymentStatus: 'PAID',
      subtotal: 104000,
      discountAmount: 10000,
      totalAmount: 94000,
      payments: [{ method: 'DEBIT', amount: 94000 }],
      items: [
        { id: 'h6', product: { name: 'Nasi Goreng Spesial' }, quantity: 3, totalPrice: 84000 },
        { id: 'h7', product: { name: 'Kopi Gula Aren' }, quantity: 1, totalPrice: 18000 }
      ]
    }
  ];

  // Search / QR Modal
  const [showSearchQrModal, setShowSearchQrModal] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');

  // Payment Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [receipt, setReceipt] = useState<any | null>(null);

  // Discount & Loyalty State inside Payment Modal
  const [discountType, setDiscountType] = useState<'NOMINAL' | 'PERCENT'>('NOMINAL');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [customerPhoneInput, setCustomerPhoneInput] = useState('');
  const [customerLoyalty, setCustomerLoyalty] = useState<any | null>(null);
  const [customerTier, setCustomerTier] = useState<any | null>(null);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // Voucher Promo State
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
  const [voucherDiscountAmount, setVoucherDiscountAmount] = useState<number>(0);

  const fetchUnpaidOrders = async () => {
    try {
      const res = await fetch('/api/kds?tenantId=bismillah-resto');
      const data = await res.json();
      if (data.success && data.orders && data.orders.length > 0) {
        const unpaid = data.orders.filter((o: any) => o.paymentStatus === 'UNPAID');
        setOrders(unpaid.length > 0 ? unpaid : demoOrders);
      } else {
        setOrders(demoOrders);
      }
    } catch (err) {
      setOrders(demoOrders);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuProducts = async () => {
    try {
      const res = await fetch('/api/customer/products?tenantSlug=bismillah-resto');
      const data = await res.json();
      if (res.ok && data.products && data.products.length > 0) {
        setCategories(data.categories);
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActiveShift = async () => {
    try {
      const res = await fetch('/api/cashier/shift/active');
      const data = await res.json();
      if (data.success && data.shift) {
        setActiveShift(data.shift);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const applyDatePreset = (preset: 'today' | 'yesterday' | 'week' | 'month') => {
    const today = new Date();
    const formatDate = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

    if (preset === 'today') {
      setStartDate(formatDate(today));
      setEndDate(formatDate(today));
    } else if (preset === 'yesterday') {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      setStartDate(formatDate(y));
      setEndDate(formatDate(y));
    } else if (preset === 'week') {
      const w = new Date(today);
      w.setDate(w.getDate() - 7);
      setStartDate(formatDate(w));
      setEndDate(formatDate(today));
    } else if (preset === 'month') {
      const m = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDate(m));
      setEndDate(formatDate(today));
    }
  };

  const filterDemoHistory = () => {
    let filtered = [...demoHistoryOrders];

    if (historyPaymentMethod !== 'ALL') {
      filtered = filtered.filter(o => o.payments?.some((p: any) => p.method === historyPaymentMethod));
    }

    if (historySearchQuery.trim()) {
      const q = historySearchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.mainCustomerName && o.mainCustomerName.toLowerCase().includes(q)) ||
        (o.mainCustomerPhone && o.mainCustomerPhone.includes(q)) ||
        o.servicePoint?.displayName?.toLowerCase().includes(q)
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(o => new Date(o.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(o => new Date(o.createdAt) <= end);
    }

    setHistoryOrders(filtered);
    const rev = filtered.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const count = filtered.length;
    setHistorySummary({
      totalRevenue: rev,
      totalTransactions: count,
      averageTransaction: count > 0 ? Math.round(rev / count) : 0
    });
  };

  const fetchHistoryOrders = async () => {
    setHistoryLoading(true);
    try {
      const query = new URLSearchParams({
        tenantId: 'bismillah-resto',
        startDate: startDate || '',
        endDate: endDate || '',
        paymentMethod: historyPaymentMethod,
        search: historySearchQuery
      }).toString();

      const res = await fetch(`/api/cashier/history?${query}`);
      const data = await res.json();

      if (data.success && data.orders && data.orders.length > 0) {
        setHistoryOrders(data.orders);
        setHistorySummary(data.summary || {
          totalRevenue: data.orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0),
          totalTransactions: data.orders.length,
          averageTransaction: Math.round(data.orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0) / data.orders.length)
        });
      } else {
        filterDemoHistory();
      }
    } catch (err) {
      filterDemoHistory();
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidOrders();
    fetchMenuProducts();
    fetchActiveShift();
  }, []);

  useEffect(() => {
    if (activeMode === 'history') {
      fetchHistoryOrders();
    }
  }, [activeMode, startDate, endDate, historyPaymentMethod, historySearchQuery]);

  // Handlers for Shift Management
  const handleOpenShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cashier/shift/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startingCash: Number(startingCashInput),
          cashierName: openShiftCashierName
        })
      });
      const data = await res.json();
      if (data.success && data.shift) {
        setActiveShift(data.shift);
      } else {
        setActiveShift({
          id: `shift-${Date.now()}`,
          cashierName: openShiftCashierName,
          startTime: new Date().toISOString(),
          status: 'OPEN',
          startingCash: Number(startingCashInput)
        });
      }
    } catch (err) {
      setActiveShift({
        id: `shift-${Date.now()}`,
        cashierName: openShiftCashierName,
        startTime: new Date().toISOString(),
        status: 'OPEN',
        startingCash: Number(startingCashInput)
      });
    } finally {
      setShowOpenShiftModal(false);
    }
  };

  const calculateShiftSales = () => {
    const paidOrders = historyOrders.length > 0 ? historyOrders : demoHistoryOrders;
    let cashSales = 0;
    let nonCashSales = 0;
    let totalCount = paidOrders.length;

    paidOrders.forEach(ord => {
      const payMethod = ord.payments?.[0]?.method || 'CASH';
      const amt = ord.totalAmount || 0;
      if (payMethod === 'CASH') {
        cashSales += amt;
      } else {
        nonCashSales += amt;
      }
    });

    const starting = activeShift ? activeShift.startingCash : startingCashInput;
    const expected = starting + cashSales;

    return {
      startingCash: starting,
      cashSales,
      nonCashSales,
      totalSales: cashSales + nonCashSales,
      totalOrdersCount: totalCount,
      expectedEndingCash: expected
    };
  };

  const handleCloseShiftSubmit = async () => {
    const shiftCalc = calculateShiftSales();
    const actual = Number(actualEndingCashInput);
    const diff = actual - shiftCalc.expectedEndingCash;
    let diffStatus = 'PAS';
    if (diff > 0) diffStatus = 'SURPLUS';
    else if (diff < 0) diffStatus = 'DEFICIT';

    try {
      const res = await fetch('/api/cashier/shift/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualEndingCash: actual,
          totalCashSales: shiftCalc.cashSales,
          totalNonCashSales: shiftCalc.nonCashSales,
          totalOrdersCount: shiftCalc.totalOrdersCount,
          notes: shiftNotesInput
        })
      });
      const data = await res.json();
      const closed = data.shift || {
        id: activeShift?.id || `shift-${Date.now()}`,
        cashierName: activeShift?.cashierName || openShiftCashierName,
        startTime: activeShift?.startTime || new Date().toISOString(),
        endTime: new Date().toISOString(),
        status: 'CLOSED',
        startingCash: shiftCalc.startingCash,
        expectedCash: shiftCalc.expectedEndingCash,
        actualEndingCash: actual,
        differenceAmount: diff,
        differenceStatus: diffStatus,
        totalCashSales: shiftCalc.cashSales,
        totalNonCashSales: shiftCalc.nonCashSales,
        totalSales: shiftCalc.totalSales,
        totalOrdersCount: shiftCalc.totalOrdersCount,
        notes: shiftNotesInput
      };

      setShiftReportData(closed);
      setActiveShift(null);
    } catch (err) {
      setShiftReportData({
        id: activeShift?.id || `shift-${Date.now()}`,
        cashierName: activeShift?.cashierName || openShiftCashierName,
        startTime: activeShift?.startTime || new Date().toISOString(),
        endTime: new Date().toISOString(),
        status: 'CLOSED',
        startingCash: shiftCalc.startingCash,
        expectedCash: shiftCalc.expectedEndingCash,
        actualEndingCash: actual,
        differenceAmount: diff,
        differenceStatus: diffStatus,
        totalCashSales: shiftCalc.cashSales,
        totalNonCashSales: shiftCalc.nonCashSales,
        totalSales: shiftCalc.totalSales,
        totalOrdersCount: shiftCalc.totalOrdersCount,
        notes: shiftNotesInput
      });
      setActiveShift(null);
    } finally {
      setShowCloseShiftModal(false);
    }
  };

  const handleSendShiftWA = () => {
    if (!shiftReportData) return;
    const phone = '081234567890';
    const msg = `*REKAP SETORAN SHIFT KASIR RESTOQU*\n` +
      `Kasir: ${shiftReportData.cashierName}\n` +
      `Jam Shift: ${new Date(shiftReportData.startTime).toLocaleTimeString('id-ID')} - ${new Date(shiftReportData.endTime).toLocaleTimeString('id-ID')}\n` +
      `--------------------------------\n` +
      `Modal Awal: Rp${shiftReportData.startingCash.toLocaleString('id-ID')}\n` +
      `Penjualan Tunai: Rp${shiftReportData.totalCashSales.toLocaleString('id-ID')}\n` +
      `Penjualan Digital: Rp${shiftReportData.totalNonCashSales.toLocaleString('id-ID')}\n` +
      `Uang Seharusnya: Rp${shiftReportData.expectedCash.toLocaleString('id-ID')}\n` +
      `Setor Fisik Laci: Rp${shiftReportData.actualEndingCash.toLocaleString('id-ID')}\n` +
      `Status Selisih: ${shiftReportData.differenceStatus} (Rp${shiftReportData.differenceAmount.toLocaleString('id-ID')})\n` +
      `Catatan: ${shiftReportData.notes || '-'}\n` +
      `--------------------------------\n` +
      `Total Omset Shift: Rp${shiftReportData.totalSales.toLocaleString('id-ID')}`;

    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Handlers for Direct Cart
  const handleUpdateDirectCart = (pId: string, delta: number) => {
    const current = directCart[pId] || 0;
    const next = Math.max(0, current + delta);
    const updated = { ...directCart };
    if (next === 0) delete updated[pId];
    else updated[pId] = next;
    setDirectCart(updated);
  };

  const directCartSubtotal = Object.entries(directCart).reduce((sum, [pId, qty]) => {
    const p = products.find(prod => prod.id === pId);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  // Submit Direct POS Order
  const handleCreateDirectOrder = () => {
    if (directCartSubtotal === 0) return;
    const items = Object.entries(directCart).map(([pId, qty]) => {
      const p = products.find(prod => prod.id === pId);
      return {
        id: `direct-${pId}`,
        product: { name: p?.name },
        quantity: qty,
        unitPrice: p?.price || 0,
        totalPrice: (p?.price || 0) * qty
      };
    });

    const newDirectOrder = {
      id: `pos-${Date.now()}`,
      orderNumber: `POS-#${Math.floor(1000 + Math.random() * 9000)}`,
      mainCustomerName: directCustomerName || 'Walk-in Customer',
      mainCustomerPhone: directCustomerPhone || '',
      servicePoint: { displayName: 'Kasir Direct (Takeaway)' },
      subtotal: directCartSubtotal,
      totalAmount: directCartSubtotal,
      items
    };

    handleOpenPayModal(newDirectOrder);
  };

  // Open Payment Modal
  const handleOpenPayModal = (order: any) => {
    setSelectedOrder(order);
    setPaymentMethod('CASH');
    setAmountPaid(order.totalAmount);
    setDiscountValue(0);
    setDiscountType('NOMINAL');
    setCustomerPhoneInput(order.mainCustomerPhone || '');
    setCustomerLoyalty(null);
    setCustomerTier(null);
    setUseLoyaltyPoints(false);
    setVoucherInput('');
    setAppliedVoucher(null);
    setVoucherDiscountAmount(0);
    setReceipt(null);

    if (order.mainCustomerPhone) {
      lookupCustomerLoyalty(order.mainCustomerPhone);
    }
  };

  // View Receipt from History
  const handleViewHistoryReceipt = (ord: any) => {
    const payMethod = ord.payments?.[0]?.method || 'CASH';
    const paidAmount = ord.payments?.[0]?.amount || ord.totalAmount;
    const change = Math.max(0, paidAmount - ord.totalAmount);

    setReceipt({
      header: 'Bismillah Resto - Sumenep\nJl. Trunojoyo No. 45',
      footer: 'Terima kasih atas kunjungan Anda!\nFollow Instagram: @bismillahresto',
      orderNumber: ord.orderNumber,
      servicePointName: ord.servicePoint?.displayName || 'Kasir / Direct',
      date: new Date(ord.createdAt).toLocaleString('id-ID'),
      items: ord.items?.map((it: any) => ({
        name: it.product?.name || it.name,
        quantity: it.quantity,
        totalPrice: it.totalPrice
      })),
      subtotal: ord.subtotal || ord.totalAmount,
      discountAmount: ord.discountAmount || 0,
      totalAmount: ord.totalAmount,
      paymentMethod: payMethod,
      amountPaid: paidAmount,
      change: change,
      mainCustomerPhone: ord.mainCustomerPhone || '081234567890'
    });
    setSelectedOrder(ord);
  };

  // Lookup Loyalty Customer & Tier
  const lookupCustomerLoyalty = async (phone: string) => {
    if (!phone || phone.length < 8) return;
    try {
      const res = await fetch(`/api/customer/loyalty?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.customer) {
          setCustomerLoyalty(data.customer);
          if (data.customer.tierInfo) {
            setCustomerTier(data.customer.tierInfo);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Apply Voucher Promo
  const handleApplyVoucher = async () => {
    if (!voucherInput.trim() || !selectedOrder) return;
    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: voucherInput,
          subtotal: selectedOrder.totalAmount,
          customerPhone: customerPhoneInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedVoucher(data.voucher);
        setVoucherDiscountAmount(data.discountAmount);
        if (data.customerTierBenefit) {
          setCustomerTier(data.customerTierBenefit);
        }
        alert(data.message);
      } else {
        alert(data.error || 'Voucher tidak valid');
      }
    } catch (e) {
      alert('Gagal memvalidasi voucher');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherDiscountAmount(0);
    setVoucherInput('');
  };

  // Search Order by QR Code or Order Number
  const handleSearchQrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) return;

    const term = qrCodeInput.trim().toLowerCase();
    const matched = orders.find(o =>
      o.orderNumber.toLowerCase().includes(term) ||
      o.id.toLowerCase().includes(term) ||
      o.servicePoint?.displayName?.toLowerCase().includes(term)
    );

    if (matched) {
      setShowSearchQrModal(false);
      setQrCodeInput('');
      handleOpenPayModal(matched);
    } else {
      const mockMatched = {
        id: `qr-ord-${term}`,
        orderNumber: term.toUpperCase().startsWith('ORDER') ? term.toUpperCase() : `Order #${term}`,
        mainCustomerName: 'QR Customer',
        mainCustomerPhone: '',
        servicePoint: { displayName: 'Meja Scanned' },
        subtotal: 45000,
        totalAmount: 45000,
        items: [
          { id: 'sqr1', product: { name: 'Paket QR Special' }, quantity: 1, totalPrice: 45000 }
        ]
      };
      setShowSearchQrModal(false);
      setQrCodeInput('');
      handleOpenPayModal(mockMatched);
    }
  };

  // Calculate Net Tagihan considering Discount, Points & Voucher
  const calculateFinalTotal = () => {
    if (!selectedOrder) return 0;
    let disc = 0;
    if (discountType === 'PERCENT') {
      disc = (selectedOrder.totalAmount * Math.min(100, Math.max(0, discountValue))) / 100;
    } else {
      disc = Math.min(selectedOrder.totalAmount, Math.max(0, discountValue));
    }

    const pointsDisc = (useLoyaltyPoints && customerLoyalty) ? (customerLoyalty.points * 100) : 0;
    const totalDeductions = disc + pointsDisc + (voucherDiscountAmount || 0);
    return Math.max(0, selectedOrder.totalAmount - totalDeductions);
  };

  const finalTotalAmount = calculateFinalTotal();
  const calculatedChange = Math.max(0, amountPaid - finalTotalAmount);

  // Process Payment
  const handleProcessPayment = async () => {
    if (!selectedOrder) return;

    let discountRp = 0;
    if (discountType === 'PERCENT') {
      discountRp = (selectedOrder.totalAmount * Math.min(100, Math.max(0, discountValue))) / 100;
    } else {
      discountRp = Math.min(selectedOrder.totalAmount, Math.max(0, discountValue));
    }

    const totalDiscountRp = discountRp + (voucherDiscountAmount || 0);

    try {
      const res = await fetch('/api/cashier/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id.startsWith('pos-') || selectedOrder.id.startsWith('demo-') ? null : selectedOrder.id,
          orderNumber: selectedOrder.orderNumber,
          method: paymentMethod,
          amountPaid: Number(amountPaid),
          discountAmount: totalDiscountRp,
          customerPhone: customerPhoneInput,
          pointsUsed: useLoyaltyPoints && customerLoyalty ? customerLoyalty.points : 0
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setReceipt({
          header: 'Bismillah Resto - Sumenep\nJl. Trunojoyo No. 45',
          footer: 'Terima kasih atas kunjungan Anda!\nFollow Instagram: @bismillahresto',
          orderNumber: selectedOrder.orderNumber,
          servicePointName: selectedOrder.servicePoint?.displayName,
          date: new Date().toLocaleString('id-ID'),
          items: selectedOrder.items?.map((it: any) => ({ name: it.product?.name || it.name, quantity: it.quantity, totalPrice: it.totalPrice })),
          subtotal: selectedOrder.subtotal,
          discountAmount: discountRp,
          totalAmount: finalTotalAmount,
          paymentMethod,
          amountPaid: Number(amountPaid),
          change: calculatedChange,
          mainCustomerPhone: customerPhoneInput
        });
      } else {
        setReceipt(data.receipt);
        setDirectCart({});
        fetchUnpaidOrders();
        if (activeMode === 'history') fetchHistoryOrders();
      }
    } catch (err) {
      setReceipt({
        header: 'Bismillah Resto - Sumenep\nJl. Trunojoyo No. 45',
        footer: 'Terima kasih atas kunjungan Anda!\nFollow Instagram: @bismillahresto',
        orderNumber: selectedOrder.orderNumber,
        servicePointName: selectedOrder.servicePoint?.displayName,
        date: new Date().toLocaleString('id-ID'),
        items: selectedOrder.items?.map((it: any) => ({ name: it.product?.name || it.name, quantity: it.quantity, totalPrice: it.totalPrice })),
        subtotal: selectedOrder.subtotal,
        discountAmount: discountRp,
        totalAmount: finalTotalAmount,
        paymentMethod,
        amountPaid: Number(amountPaid),
        change: calculatedChange,
        mainCustomerPhone: customerPhoneInput
      });
    }
  };

  const handleSendWhatsAppReceipt = () => {
    if (!receipt) return;
    const phone = receipt.mainCustomerPhone || '081234567890';
    const message = `*STRUK PEMBAYARAN RESTOQU*\n` +
      `No. Order: ${receipt.orderNumber}\n` +
      `Tanggal: ${receipt.date}\n` +
      `Meja/Tipe: ${receipt.servicePointName}\n` +
      `--------------------------------\n` +
      receipt.items?.map((i: any) => `${i.name} x${i.quantity} = Rp${i.totalPrice.toLocaleString('id-ID')}`).join('\n') +
      `\n--------------------------------\n` +
      `Total: Rp${receipt.totalAmount.toLocaleString('id-ID')}\n` +
      `Metode: ${receipt.paymentMethod}\n` +
      `Terima Kasih Atas Kunjungan Anda!`;

    const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.servicePoint?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.mainCustomerName && o.mainCustomerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : products.filter(p => p.category === selectedCategory || p.categoryId === selectedCategory);

  const shiftCalculation = calculateShiftSales();

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
        padding: '16px 20px 14px',
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
              <p style={{ fontSize: '0.7rem', color: '#247d68', fontWeight: 800, textTransform: 'uppercase' }}>RESTOQU POS KASIR</p>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d2925', letterSpacing: -0.3 }}>Kasir & Pembayaran</h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowSearchQrModal(true)}
              style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', color: '#247d68', border: '1px solid #247d68', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              title="Scan / Cari QR Pesanan"
            >
              <QrCode size={18} />
            </button>
            <button
              onClick={activeMode === 'history' ? fetchHistoryOrders : fetchUnpaidOrders}
              style={{ width: 36, height: 36, borderRadius: '50%', background: '#247d68', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Shift Control Status Pill */}
        <div style={{
          marginTop: 10, background: activeShift ? '#e6f4ea' : '#fef3c7', borderRadius: 14, padding: '8px 12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: activeShift ? '1px solid #a7f3d0' : '1px solid #fde68a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {activeShift ? <Unlock size={16} style={{ color: '#166534' }} /> : <Lock size={16} style={{ color: '#92400e' }} />}
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: activeShift ? '#166534' : '#92400e', display: 'block' }}>
                {activeShift ? `🟢 SHIFT AKTIF: ${activeShift.cashierName}` : '🟡 SHIFT KASIR BELUM DIBUKA'}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#4b5563', fontWeight: 600 }}>
                {activeShift ? `Modal: Rp${activeShift.startingCash?.toLocaleString('id-ID')}` : 'Buka shift untuk memproses setoran'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MODE 1: TAGIHAN MEJA & ORDER LIST */}
      {activeMode === 'orders' && (
        <main style={{ padding: '0 20px' }}>
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#9ca3af' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari No Order, Meja, atau Pelanggan..."
              style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 14, background: '#ffffff', border: '1px solid #e5e7eb', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredOrders.map(ord => (
              <div key={ord.id} style={{ background: '#ffffff', borderRadius: 24, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{ord.orderNumber}</span>
                    <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 800, background: '#fef3c7', color: '#92400e' }}>
                      {ord.servicePoint?.displayName}
                    </span>
                  </div>

                  {ord.mainCustomerName && (
                    <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 10 }}>
                      Atas Nama: <strong style={{ color: '#1d2925' }}>{ord.mainCustomerName}</strong> {ord.mainCustomerPhone ? `(${ord.mainCustomerPhone})` : ''}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid #f3f4f6', paddingTop: 10 }}>
                    {ord.items?.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>{item.product?.name} × {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>Rp{item.totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: 12, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4b5563' }}>Total Tagihan</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#247d68' }}>Rp{ord.totalAmount?.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenPayModal(ord)}
                  style={{
                    width: '100%', marginTop: 14, padding: 12, borderRadius: 14,
                    background: '#247d68', color: '#ffffff', border: 'none',
                    fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(36, 125, 104, 0.3)'
                  }}
                >
                  Proses Bayar Tagihan
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* MODE 2: DIRECT POS ORDER ENTRY */}
      {activeMode === 'direct' && (
        <main style={{ padding: '0 20px' }}>
          <div style={{ background: '#ffffff', borderRadius: 20, padding: 14, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>NAMA PELANGGAN</label>
              <input
                type="text"
                value={directCustomerName}
                onChange={e => setDirectCustomerName(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>NO. WHATSAPP (MEMBER)</label>
              <input
                type="tel"
                value={directCustomerPhone}
                onChange={e => setDirectCustomerPhone(e.target.value)}
                placeholder="08123456..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 12 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px', borderRadius: 9999, border: 'none', fontSize: '0.78rem', fontWeight: 800, whiteSpace: 'nowrap', cursor: 'pointer',
                  background: selectedCategory === cat.id ? '#247d68' : '#ffffff',
                  color: selectedCategory === cat.id ? '#ffffff' : '#4b5563',
                  boxShadow: selectedCategory === cat.id ? '0 3px 8px rgba(36,125,104,0.3)' : '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 80 }}>
            {filteredProducts.map(p => {
              const qty = directCart[p.id] || 0;
              return (
                <div key={p.id} style={{ background: '#ffffff', borderRadius: 20, padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 14 }} />
                  <div style={{ marginTop: 8 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1d2925' }}>{p.name}</h4>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#247d68', display: 'block', marginTop: 2 }}>
                      Rp{p.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    {qty === 0 ? (
                      <button
                        onClick={() => handleUpdateDirectCart(p.id, 1)}
                        style={{ width: 30, height: 30, borderRadius: '50%', background: '#247d68', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dff3e9', borderRadius: 9999, padding: '2px 6px' }}>
                        <button onClick={() => handleUpdateDirectCart(p.id, -1)} style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', border: 'none', color: '#247d68', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#247d68' }}>{qty}</span>
                        <button onClick={() => handleUpdateDirectCart(p.id, 1)} style={{ width: 22, height: 22, borderRadius: '50%', background: '#247d68', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {directCartSubtotal > 0 && (
            <div style={{
              position: 'fixed', bottom: 70, left: '50%', transform: 'translateX(-50%)',
              width: 'calc(100% - 40px)', maxWidth: 440, background: '#173f35', color: '#ffffff',
              padding: '14px 20px', borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase' }}>TOTAL DIRECT ORDER</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Rp{directCartSubtotal.toLocaleString('id-ID')}</h3>
              </div>

              <button
                onClick={handleCreateDirectOrder}
                style={{ padding: '10px 18px', borderRadius: 14, background: '#ffffff', color: '#173f35', border: 'none', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Bayar Sekarang →
              </button>
            </div>
          )}
        </main>
      )}

      {/* MODE 3: RIWAYAT TRANSAKSI & FILTER TANGGAL */}
      {activeMode === 'history' && (
        <main style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
            {[
              { id: 'today', label: 'Hari Ini' },
              { id: 'yesterday', label: 'Kemarin' },
              { id: 'week', label: '7 Hari Terakhir' },
              { id: 'month', label: 'Bulan Ini' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => applyDatePreset(p.id as any)}
                style={{
                  padding: '6px 12px', borderRadius: 9999, border: '1px solid #d1d5db',
                  background: '#ffffff', color: '#1d2925', fontSize: '0.75rem', fontWeight: 800,
                  cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#ffffff', borderRadius: 20, padding: 14, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#247d68', fontWeight: 800, fontSize: '0.8rem' }}>
              <Calendar size={16} />
              <span>FILTER RENTANG TANGGAL</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>TANGGAL MULAI</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>TANGGAL AKHIR</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 8, marginBottom: 14 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#9ca3af' }} />
              <input
                type="text"
                value={historySearchQuery}
                onChange={e => setHistorySearchQuery(e.target.value)}
                placeholder="Cari Order / Nama..."
                style={{ width: '100%', padding: '8px 10px 8px 36px', borderRadius: 12, background: '#ffffff', border: '1px solid #e5e7eb', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
              />
            </div>

            <select
              value={historyPaymentMethod}
              onChange={e => setHistoryPaymentMethod(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 12, background: '#ffffff', border: '1px solid #e5e7eb', fontSize: '0.78rem', fontWeight: 800, color: '#247d68', outline: 'none', cursor: 'pointer' }}
            >
              <option value="ALL">Semua Metode</option>
              <option value="CASH">CASH</option>
              <option value="QRIS">QRIS</option>
              <option value="DEBIT">DEBIT</option>
              <option value="E_WALLET">E-Wallet</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            <div style={{ background: '#247d68', color: '#ffffff', padding: 12, borderRadius: 18, boxShadow: '0 4px 12px rgba(36,125,104,0.25)' }}>
              <span style={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>TOTAL OMSET</span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginTop: 2 }}>Rp{historySummary.totalRevenue.toLocaleString('id-ID')}</h3>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: 12, borderRadius: 18 }}>
              <span style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>TRANSAKSI</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, marginTop: 2, color: '#1d2925' }}>{historySummary.totalTransactions} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Lunas</span></h3>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: 12, borderRadius: 18 }}>
              <span style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>RATA-RATA</span>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 900, marginTop: 2, color: '#1d2925' }}>Rp{historySummary.averageTransaction.toLocaleString('id-ID')}</h3>
            </div>
          </div>

          {historyLoading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280', fontWeight: 700, fontSize: '0.85rem' }}>
              Memuat Riwayat Transaksi...
            </div>
          ) : historyOrders.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: 20, padding: 30, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <History size={36} style={{ color: '#9ca3af', margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1d2925' }}>Tidak Ada Transaksi</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 4 }}>
                Belum ada transaksi lunas pada tanggal atau filter yang dipilih.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {historyOrders.map(ord => {
                const payMethod = ord.payments?.[0]?.method || 'CASH';
                const formattedDate = new Date(ord.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date(ord.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

                return (
                  <div key={ord.id} style={{ background: '#ffffff', borderRadius: 20, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #247d68' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1d2925' }}>{ord.orderNumber}</span>
                          <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 9999, fontWeight: 800, background: '#dcfce7', color: '#166534' }}>
                            {payMethod}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> {formattedDate} • {ord.servicePoint?.displayName || 'Kasir'}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: '#247d68' }}>
                          Rp{ord.totalAmount?.toLocaleString('id-ID')}
                        </span>
                        {ord.discountAmount > 0 && (
                          <span style={{ fontSize: '0.7rem', color: '#dc2626', display: 'block', fontWeight: 700 }}>
                            Diskon: -Rp{ord.discountAmount.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                    </div>

                    {ord.mainCustomerName && (
                      <p style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: 8, background: '#f9fafb', padding: '4px 8px', borderRadius: 8 }}>
                        Pelanggan: <strong>{ord.mainCustomerName}</strong> {ord.mainCustomerPhone ? `(${ord.mainCustomerPhone})` : ''}
                      </p>
                    )}

                    <div style={{ fontSize: '0.78rem', color: '#4b5563', borderTop: '1px solid #f3f4f6', paddingTop: 8, marginBottom: 12 }}>
                      {ord.items?.map((it: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span>{it.product?.name || it.name} ×{it.quantity}</span>
                          <span style={{ fontWeight: 600 }}>Rp{it.totalPrice?.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button
                        onClick={() => handleViewHistoryReceipt(ord)}
                        style={{
                          padding: '8px', borderRadius: 10, background: '#f3f4f6', color: '#1d2925',
                          border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                        }}
                      >
                        <Printer size={14} /> Cetak Struk
                      </button>

                      <button
                        onClick={() => {
                          const phone = ord.mainCustomerPhone || '081234567890';
                          const msg = `*STRUK RESTOQU (RIWAYAT)*\nOrder: ${ord.orderNumber}\nTotal: Rp${ord.totalAmount?.toLocaleString('id-ID')}\nMetode: ${payMethod}\nTerima kasih!`;
                          window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        style={{
                          padding: '8px', borderRadius: 10, background: '#dcfce7', color: '#166534',
                          border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                        }}
                      >
                        <Send size={14} /> Kirim WA
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* FIXED BOTTOM NAVBAR FOR CASHIER */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '8px 12px 14px', zIndex: 90, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
      }}>
        <button
          onClick={() => setActiveMode('orders')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
            color: activeMode === 'orders' ? '#247d68' : '#9ca3af'
          }}
        >
          <div style={{ position: 'relative' }}>
            <Receipt size={20} />
            {orders.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -8, background: '#dc2626', color: '#fff', fontSize: '0.6rem', fontWeight: 900, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {orders.length}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: activeMode === 'orders' ? 900 : 700 }}>Tagihan</span>
        </button>

        <button
          onClick={() => setActiveMode('direct')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
            color: activeMode === 'direct' ? '#247d68' : '#9ca3af'
          }}
        >
          <ShoppingBag size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeMode === 'direct' ? 900 : 700 }}>Direct POS</span>
        </button>

        <button
          onClick={() => setActiveMode('history')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
            color: activeMode === 'history' ? '#247d68' : '#9ca3af'
          }}
        >
          <History size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeMode === 'history' ? 900 : 700 }}>Riwayat</span>
        </button>

        <button
          onClick={() => {
            if (activeShift) {
              setActualEndingCashInput(shiftCalculation.expectedEndingCash);
              setShowCloseShiftModal(true);
            } else {
              setShowOpenShiftModal(true);
            }
          }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
            color: activeShift ? '#166534' : '#d97706'
          }}
        >
          {activeShift ? <Unlock size={20} /> : <Lock size={20} />}
          <span style={{ fontSize: '0.68rem', fontWeight: 900 }}>{activeShift ? 'Tutup Shift' : 'Buka Shift'}</span>
        </button>
      </nav>

      {/* MODAL 1: BUKA SHIFT KASIR */}
      {showOpenShiftModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 380, background: '#ffffff', borderRadius: 28, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Unlock size={20} style={{ color: '#247d68' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Buka Shift Kasir Baru</h3>
              </div>
              <button onClick={() => setShowOpenShiftModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleOpenShiftSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 4 }}>NAMA KASIR / PETUGAS</label>
                <input
                  type="text"
                  value={openShiftCashierName}
                  onChange={e => setOpenShiftCashierName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', fontWeight: 800, outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 4 }}>MODAL AWAL KAS (STARTING FLOAT)</label>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: 8 }}>Jumlah uang fisik awal di laci kasir untuk kembalian.</p>

                <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto' }}>
                  {[100000, 200000, 300000, 500000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setStartingCashInput(val)}
                      style={{ padding: '6px 10px', borderRadius: 8, background: startingCashInput === val ? '#247d68' : '#f3f4f6', color: startingCashInput === val ? '#fff' : '#1d2925', border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Rp{val.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  value={startingCashInput}
                  onChange={e => setStartingCashInput(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 12, background: '#f9fafb', border: '2px solid #247d68', fontSize: '1.1rem', fontWeight: 900, color: '#247d68', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}
              >
                [ Buka Shift Sekarang ]
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TUTUP SHIFT & REKONSILIASI KAS */}
      {showCloseShiftModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', borderRadius: '28px 28px 0 0', padding: 24, background: '#ffffff', boxShadow: '0 -10px 30px rgba(0,0,0,0.2)', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={20} style={{ color: '#dc2626' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900 }}>Tutup Shift & Rekonsiliasi Kas</h3>
              </div>
              <button onClick={() => setShowCloseShiftModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f9fafb', borderRadius: 18, padding: 14, marginBottom: 16, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>
                <span>Modal Awal Kas:</span>
                <span style={{ fontWeight: 700, color: '#1d2925' }}>Rp{shiftCalculation.startingCash.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>
                <span>Total Penjualan Tunai (Cash):</span>
                <span style={{ fontWeight: 700, color: '#166534' }}>+Rp{shiftCalculation.cashSales.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>
                <span>Total Penjualan Non-Tunai (QRIS/Debit):</span>
                <span style={{ fontWeight: 700, color: '#0284c7' }}>Rp{shiftCalculation.nonCashSales.toLocaleString('id-ID')}</span>
              </div>

              <div style={{ borderTop: '1px dashed #d1d5db', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 900, color: '#1d2925' }}>
                <span>UANG SEHARUSNYA DI LACI:</span>
                <span style={{ color: '#247d68' }}>Rp{shiftCalculation.expectedEndingCash.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d2925', display: 'block', marginBottom: 4 }}>
                JUMLAH UANG FISIK DI LACI KASIR (HASIL HITUNG FISIK)
              </label>

              <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto' }}>
                <button
                  type="button"
                  onClick={() => setActualEndingCashInput(shiftCalculation.expectedEndingCash)}
                  style={{ padding: '6px 10px', borderRadius: 8, background: '#247d68', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  [ Pas Sesuai Seharusnya ]
                </button>
              </div>

              <input
                type="number"
                value={actualEndingCashInput}
                onChange={e => setActualEndingCashInput(Number(e.target.value))}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: '#ffffff', border: '2px solid #dc2626', fontSize: '1.2rem', fontWeight: 900, outline: 'none' }}
              />
            </div>

            {(() => {
              const diff = Number(actualEndingCashInput) - shiftCalculation.expectedEndingCash;
              return (
                <div style={{
                  padding: 12, borderRadius: 16, marginBottom: 16,
                  background: diff === 0 ? '#dcfce7' : diff > 0 ? '#fef3c7' : '#fee2e2',
                  border: diff === 0 ? '1px solid #86efac' : diff > 0 ? '1px solid #fde047' : '1px solid #fca5a5'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: diff === 0 ? '#166534' : diff > 0 ? '#854d0e' : '#991b1b' }}>
                      {diff === 0 ? '✅ UANG FISIK PAS' : diff > 0 ? '⚠️ SELISIH LEBIH (SURPLUS)' : '❌ SELISIH KURANG (DEFICIT)'}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: diff === 0 ? '#166534' : diff > 0 ? '#854d0e' : '#991b1b' }}>
                      {diff > 0 ? `+Rp${diff.toLocaleString('id-ID')}` : `Rp${diff.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 4 }}>CATATAN SETORAN / PENJELASAN SELISIH</label>
              <textarea
                value={shiftNotesInput}
                onChange={e => setShiftNotesInput(e.target.value)}
                placeholder="Contoh: Ada kembalian kurang Rp 2.000 atau Uang Pas..."
                rows={2}
                style={{ width: '100%', padding: '10px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowCloseShiftModal(false)} style={{ flex: 1, padding: 12, borderRadius: 14, background: '#f3f4f6', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                Batal
              </button>
              <button onClick={handleCloseShiftSubmit} style={{ flex: 2, padding: 12, borderRadius: 14, background: '#dc2626', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>
                [ Konfirmasi Tutup Shift ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHIFT REPORT / Z-REPORT PRINT MODAL */}
      {shiftReportData && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 380, background: '#ffffff', borderRadius: 28, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <CheckCircle size={44} style={{ color: '#247d68', margin: '0 auto 8px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Shift Berhasil Ditutup!</h3>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>Laporan Rekap Setoran Shift (Z-Report) telah dicatat.</p>
            </div>

            <div style={{ background: '#f9fafb', color: '#000', padding: 16, borderRadius: 16, border: '1px solid #e5e7eb', fontFamily: 'monospace', fontSize: '0.78rem', textAlign: 'left', marginBottom: 16 }}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1px dashed #000', paddingBottom: 6, marginBottom: 6 }}>
                RESTOQU POS - REKAP SHIFT (Z-REPORT)
              </div>
              <div>Kasir: {shiftReportData.cashierName}</div>
              <div>Buka: {new Date(shiftReportData.startTime).toLocaleTimeString('id-ID')}</div>
              <div>Tutup: {new Date(shiftReportData.endTime).toLocaleTimeString('id-ID')}</div>
              <div style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Modal Awal:</span>
                <span>Rp{shiftReportData.startingCash?.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Penjualan Tunai:</span>
                <span>Rp{shiftReportData.totalCashSales?.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Penjualan Digital:</span>
                <span>Rp{shiftReportData.totalNonCashSales?.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Uang Seharusnya:</span>
                <span>Rp{shiftReportData.expectedCash?.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Setor Fisik Laci:</span>
                <span>Rp{shiftReportData.actualEndingCash?.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: shiftReportData.differenceAmount === 0 ? '#166534' : '#dc2626', fontWeight: 'bold' }}>
                <span>Status Selisih:</span>
                <span>{shiftReportData.differenceStatus} ({shiftReportData.differenceAmount})</span>
              </div>
              {shiftReportData.notes && (
                <div style={{ marginTop: 6, fontStyle: 'italic' }}>Catatan: {shiftReportData.notes}</div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <button onClick={() => window.print()} style={{ padding: 12, borderRadius: 14, background: '#f3f4f6', border: '1px solid #d1d5db', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Printer size={16} /> Cetak Z-Report
              </button>
              <button onClick={handleSendShiftWA} style={{ padding: 12, borderRadius: 14, background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Send size={16} /> Kirim WA Owner
              </button>
            </div>

            <button onClick={() => setShiftReportData(null)} style={{ width: '100%', padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* SEARCH / QR CODE LOOKUP MODAL */}
      {showSearchQrModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#ffffff', borderRadius: 28, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Scan / Cari QR Pesanan</h3>
              <button onClick={() => setShowSearchQrModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 16 }}>
              Masukkan Kode QR / Nomor Order pelanggan yang ditunjukkan pada screen HP.
            </p>

            <form onSubmit={handleSearchQrSubmit}>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  value={qrCodeInput}
                  onChange={e => setQrCodeInput(e.target.value)}
                  placeholder="Contoh: Order #1024 atau 1024"
                  autoFocus
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: '#f9fafb', border: '2px solid #247d68', fontSize: '1rem', fontWeight: 800, outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                [ Cari Tagihan Pesanan ]
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ENHANCED PAYMENT & RECEIPT MODAL */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', borderRadius: '28px 28px 0 0', padding: 24, background: '#ffffff', boxShadow: '0 -10px 30px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            {!receipt ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Pembayaran {selectedOrder.orderNumber}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>
                      {selectedOrder.servicePoint?.displayName} • Atas Nama: <strong>{selectedOrder.mainCustomerName}</strong>
                    </p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: 16, padding: 12, marginBottom: 16, fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 100, overflowY: 'auto' }}>
                    {selectedOrder.items?.map((it: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{it.product?.name || it.name} ×{it.quantity}</span>
                        <span style={{ fontWeight: 700 }}>Rp{it.totalPrice?.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 6 }}>METODE PEMBAYARAN</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    {['CASH', 'QRIS', 'DEBIT', 'E_WALLET', 'TRANSFER'].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        style={{
                          padding: '8px', borderRadius: 12, border: paymentMethod === m ? '2px solid #247d68' : '1px solid #e5e7eb', fontSize: '0.78rem', fontWeight: 800,
                          background: paymentMethod === m ? '#dff3e9' : '#f9fafb',
                          color: paymentMethod === m ? '#247d68' : '#4b5563', cursor: 'pointer'
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'CASH' && (
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 6 }}>NOMINAL UANG TERIMA (QUICK CASH)</label>
                    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 8 }}>
                      <button
                        type="button"
                        onClick={() => setAmountPaid(finalTotalAmount)}
                        style={{ padding: '6px 12px', borderRadius: 10, background: '#247d68', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        [ Uang Pas ]
                      </button>
                      {[20000, 50000, 100000, 200000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmountPaid(val)}
                          style={{ padding: '6px 12px', borderRadius: 10, background: '#f3f4f6', color: '#1d2925', border: '1px solid #d1d5db', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          Rp{val.toLocaleString('id-ID')}
                        </button>
                      ))}
                    </div>

                    <input
                      type="number"
                      value={amountPaid}
                      onChange={e => setAmountPaid(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '1rem', fontWeight: 900, outline: 'none' }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: 14, background: '#f9fafb', padding: 12, borderRadius: 16, border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Tag size={14} style={{ color: '#247d68' }} /> DISKON / PROMO
                    </span>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        type="button"
                        onClick={() => setDiscountType('NOMINAL')}
                        style={{ padding: '2px 8px', borderRadius: 6, border: 'none', fontSize: '0.7rem', fontWeight: 800, background: discountType === 'NOMINAL' ? '#247d68' : '#e5e7eb', color: discountType === 'NOMINAL' ? '#fff' : '#4b5563', cursor: 'pointer' }}
                      >
                        Rp
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('PERCENT')}
                        style={{ padding: '2px 8px', borderRadius: 6, border: 'none', fontSize: '0.7rem', fontWeight: 800, background: discountType === 'PERCENT' ? '#247d68' : '#e5e7eb', color: discountType === 'PERCENT' ? '#fff' : '#4b5563', cursor: 'pointer' }}
                      >
                        %
                      </button>
                    </div>
                  </div>

                  <input
                    type="number"
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    placeholder={discountType === 'PERCENT' ? 'Nilai Diskon (%)' : 'Nilai Diskon (Rp)'}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #e5e7eb', fontSize: '0.88rem', fontWeight: 700, outline: 'none' }}
                  />
                </div>

                {/* Voucher Promo Input */}
                <div style={{ marginBottom: 14, background: '#f8fafc', padding: 12, borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Ticket size={14} style={{ color: '#247d68' }} /> VOUCHER PROMO / KUPON
                    </span>
                    {appliedVoucher && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534' }}>
                        Potongan: <strong>-Rp{voucherDiscountAmount.toLocaleString('id-ID')}</strong>
                      </span>
                    )}
                  </div>

                  {!appliedVoucher ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={e => setVoucherInput(e.target.value.toUpperCase())}
                        placeholder="Contoh: RESTOQU25K / HAPPYHOUR20"
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 800, letterSpacing: 1, outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        style={{ padding: '8px 14px', borderRadius: 10, background: '#247d68', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Klaim
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#dcfce7', padding: '8px 12px', borderRadius: 10, border: '1px solid #86efac' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#166534' }}>{appliedVoucher.code}</span>
                        <span style={{ fontSize: '0.72rem', color: '#15803d' }}>• {appliedVoucher.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

                {/* Loyalty & Tier Membership */}
                <div style={{ marginBottom: 16, background: '#f0fdf4', padding: 12, borderRadius: 16, border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Gift size={14} /> LOYALTY MEMBER & TIER
                    </span>
                    {customerTier && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        background: customerTier.bgBadge,
                        color: customerTier.color
                      }}>
                        {customerTier.tier} TIER
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="tel"
                      value={customerPhoneInput}
                      onChange={e => setCustomerPhoneInput(e.target.value)}
                      placeholder="Nomor WhatsApp Pelanggan..."
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 10, background: '#ffffff', border: '1px solid #bbf7d0', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => lookupCustomerLoyalty(customerPhoneInput)}
                      style={{ padding: '8px 12px', borderRadius: 10, background: '#166534', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Cek Poin & Tier
                    </button>
                  </div>

                  {customerLoyalty && (
                    <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
                      <div>Poin Tersedia: <strong>{customerLoyalty.points} Poin</strong></div>
                      {customerLoyalty.points > 0 && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={useLoyaltyPoints}
                            onChange={e => setUseLoyaltyPoints(e.target.checked)}
                          />
                          Tukarkan {customerLoyalty.points} Poin (Diskon Rp{(customerLoyalty.points * 100).toLocaleString('id-ID')})
                        </label>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', marginBottom: 4 }}>
                    <span>Subtotal:</span>
                    <span>Rp{selectedOrder.totalAmount?.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#dc2626', marginBottom: 4 }}>
                    <span>Diskon & Poin:</span>
                    <span>-Rp{(selectedOrder.totalAmount - finalTotalAmount).toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: '#1d2925', marginTop: 4 }}>
                    <span>Total Net Bayar:</span>
                    <span style={{ color: '#247d68' }}>Rp{finalTotalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  {paymentMethod === 'CASH' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, marginTop: 4 }}>
                      <span>Kembalian Uang:</span>
                      <span style={{ color: '#247d68' }}>Rp{calculatedChange.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setSelectedOrder(null)} style={{ flex: 1, padding: 12, borderRadius: 14, background: '#f3f4f6', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                    Batal
                  </button>
                  <button onClick={handleProcessPayment} style={{ flex: 2, padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}>
                    [ Proses Lunas ]
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={48} style={{ color: '#247d68', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: 4 }}>Pembayaran Lunas!</h3>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 16 }}>Transaksi telah berhasil diproses ke sistem RestoQu.</p>

                <div style={{ background: '#f9fafb', color: '#000', padding: 16, borderRadius: 16, border: '1px solid #e5e7eb', fontFamily: 'monospace', fontSize: '0.78rem', textAlign: 'left', marginBottom: 16 }}>
                  <div style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1px dashed #000', paddingBottom: 6, marginBottom: 6 }}>
                    {receipt.header}
                  </div>
                  <div>No. Order: {receipt.orderNumber}</div>
                  <div>Tanggal: {receipt.date}</div>
                  <div>Meja/Tipe: {receipt.servicePointName}</div>
                  <div style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
                  {receipt.items?.map((it: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{it.name} ×{it.quantity}</span>
                      <span>Rp{it.totalPrice?.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                  <div style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />
                  {receipt.discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                      <span>Diskon</span>
                      <span>-Rp{receipt.discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.88rem' }}>
                    <span>TOTAL BAYAR</span>
                    <span>Rp{receipt.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <span>Bayar ({receipt.paymentMethod})</span>
                    <span>Rp{receipt.amountPaid.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Kembalian</span>
                    <span>Rp{receipt.change.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <button onClick={() => window.print()} style={{ padding: 12, borderRadius: 14, background: '#f3f4f6', border: '1px solid #d1d5db', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Printer size={16} /> Cetak Struk
                  </button>
                  <button onClick={handleSendWhatsAppReceipt} style={{ padding: 12, borderRadius: 14, background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Send size={16} /> Kirim Struk WA
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* PERMANENT FIXED CASHIER BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '10px 12px 16px', zIndex: 99999, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)'
      }}>
        <button
          onClick={() => setActiveMode('orders')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeMode === 'orders' ? '#247d68' : '#9ca3af' }}
        >
          <Receipt size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeMode === 'orders' ? 900 : 700 }}>Tagihan</span>
        </button>

        <button
          onClick={() => setActiveMode('direct')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeMode === 'direct' ? '#247d68' : '#9ca3af' }}
        >
          <ShoppingBag size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeMode === 'direct' ? 900 : 700 }}>Direct POS</span>
        </button>

        <button
          onClick={() => setActiveMode('history')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: activeMode === 'history' ? '#247d68' : '#9ca3af' }}
        >
          <History size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeMode === 'history' ? 900 : 700 }}>Riwayat</span>
        </button>

        <button
          onClick={() => activeShift?.status === 'OPEN' ? setShowCloseShiftModal(true) : setShowOpenShiftModal(true)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', color: '#d97706' }}
        >
          <Lock size={20} />
          <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>Shift Kasir</span>
        </button>
      </nav>

      {/* Thermal Receipt Modal */}
      <ReceiptModal
        isOpen={!!receipt}
        onClose={() => setReceipt(null)}
        receiptData={receipt}
        rawOrder={selectedOrder}
      />
    </div>
  );
}
