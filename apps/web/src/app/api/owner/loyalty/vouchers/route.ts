import { NextResponse } from 'next/server';
import { initialVouchers, VoucherPromo } from '@/lib/store';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      vouchers: initialVouchers
    });
  } catch (error) {
    console.error('[API Owner Vouchers GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data voucher' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      title,
      discountType,
      discountValue,
      minSpend = 0,
      maxDiscount,
      expiryDate,
      usageLimit = 100,
      isHappyHour = false,
      happyHourStart,
      happyHourEnd
    } = body;

    if (!code || !title || !discountValue || !expiryDate) {
      return NextResponse.json({ error: 'Kode, judul, nilai diskon, dan masa berlaku wajib diisi' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    if (initialVouchers.some(v => v.code === cleanCode)) {
      return NextResponse.json({ error: `Kode voucher ${cleanCode} sudah terdaftar` }, { status: 400 });
    }

    const newVoucher: VoucherPromo = {
      id: `v-${Date.now()}`,
      code: cleanCode,
      title,
      discountType: discountType || 'NOMINAL',
      discountValue: Number(discountValue),
      minSpend: Number(minSpend || 0),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      expiryDate,
      status: 'ACTIVE',
      usageLimit: Number(usageLimit || 100),
      usedCount: 0,
      isHappyHour: Boolean(isHappyHour),
      happyHourStart: happyHourStart || undefined,
      happyHourEnd: happyHourEnd || undefined
    };

    initialVouchers.unshift(newVoucher);

    return NextResponse.json({
      success: true,
      voucher: newVoucher,
      message: 'Voucher promo berhasil dibuat'
    });
  } catch (error) {
    console.error('[API Owner Vouchers POST Error]:', error);
    return NextResponse.json({ error: 'Gagal membuat voucher promo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID voucher wajib diisi' }, { status: 400 });
    }

    const idx = initialVouchers.findIndex(v => v.id === id);
    if (idx !== -1) {
      initialVouchers.splice(idx, 1);
    }

    return NextResponse.json({
      success: true,
      message: 'Voucher berhasil dihapus'
    });
  } catch (error) {
    console.error('[API Owner Vouchers DELETE Error]:', error);
    return NextResponse.json({ error: 'Gagal menghapus voucher' }, { status: 500 });
  }
}
