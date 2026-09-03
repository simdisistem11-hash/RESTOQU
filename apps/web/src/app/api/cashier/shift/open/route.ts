import { NextResponse } from 'next/server';
import { currentActiveShift, setCurrentActiveShift } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { startingCash = 0, cashierName = 'Kasir RestoQu', tenantId = 'bismillah-resto' } = await request.json();

    const newShift = {
      id: `shift-${Date.now()}`,
      tenantId,
      cashierName,
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'OPEN',
      startingCash: Number(startingCash),
      expectedCash: Number(startingCash),
      actualEndingCash: 0,
      differenceAmount: 0,
      differenceStatus: 'PAS',
      totalCashSales: 0,
      totalNonCashSales: 0,
      totalSales: 0,
      totalOrdersCount: 0,
      notes: '',
      createdAt: new Date().toISOString()
    };

    setCurrentActiveShift(newShift);

    return NextResponse.json({
      success: true,
      shift: newShift,
      message: 'Shift kasir berhasil dibuka'
    });
  } catch (error) {
    console.error('[API Cashier Shift Open Error]:', error);
    return NextResponse.json({ error: 'Gagal membuka shift kasir' }, { status: 500 });
  }
}
