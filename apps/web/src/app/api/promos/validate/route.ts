import { NextResponse } from 'next/server';
import { initialVouchers, getTierByPoints, initialCustomers } from '@/lib/store';
import { prisma } from '@restoqu/database';

export async function POST(request: Request) {
  try {
    const { code, subtotal = 0, customerPhone } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Kode voucher wajib diisi' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    const voucher = initialVouchers.find(v => v.code === cleanCode && v.status === 'ACTIVE');

    if (!voucher) {
      return NextResponse.json({ error: 'Kode voucher tidak valid atau sudah tidak aktif' }, { status: 404 });
    }

    // Check expiry
    const today = new Date().toISOString().slice(0, 10);
    if (voucher.expiryDate < today) {
      return NextResponse.json({ error: 'Voucher telah melewati masa berlaku' }, { status: 400 });
    }

    // Check minimum spend
    if (Number(subtotal) < voucher.minSpend) {
      return NextResponse.json({
        error: `Minimal transaksi untuk voucher ini adalah Rp${voucher.minSpend.toLocaleString('id-ID')}`
      }, { status: 400 });
    }

    // Check Happy Hour if enabled
    if (voucher.isHappyHour && voucher.happyHourStart && voucher.happyHourEnd) {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (currentTimeStr < voucher.happyHourStart || currentTimeStr > voucher.happyHourEnd) {
        return NextResponse.json({
          error: `Voucher Happy Hour ini hanya berlaku pukul ${voucher.happyHourStart} s.d ${voucher.happyHourEnd} WIB`
        }, { status: 400 });
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (voucher.discountType === 'NOMINAL') {
      discountAmount = voucher.discountValue;
    } else {
      // Percentage
      const calculated = Math.round((Number(subtotal) * voucher.discountValue) / 100);
      discountAmount = voucher.maxDiscount ? Math.min(calculated, voucher.maxDiscount) : calculated;
    }

    // Cap discount to subtotal
    discountAmount = Math.min(discountAmount, Number(subtotal));

    // Also check customer tier benefit if phone provided
    let customerTierBenefit = null;
    if (customerPhone) {
      let points = 0;
      try {
        const dbCust = await prisma.customer.findFirst({
          where: { phone: customerPhone.trim() }
        });
        if (dbCust) {
          points = dbCust.points;
        } else {
          const mock = initialCustomers.find(c => c.phone === customerPhone.trim());
          if (mock) points = mock.points;
        }
      } catch (e) {
        const mock = initialCustomers.find(c => c.phone === customerPhone.trim());
        if (mock) points = mock.points;
      }

      customerTierBenefit = getTierByPoints(points);
    }

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        title: voucher.title,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue
      },
      discountAmount,
      customerTierBenefit,
      message: `Voucher ${voucher.code} berhasil diterapkan! Diskon Rp${discountAmount.toLocaleString('id-ID')}`
    });
  } catch (error) {
    console.error('[API Promo Validate Error]:', error);
    return NextResponse.json({ error: 'Gagal memvalidasi promo' }, { status: 500 });
  }
}
