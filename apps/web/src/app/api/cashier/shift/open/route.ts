import { NextResponse } from 'next/server';

export let currentActiveShift: any = null;
export let shiftHistory: any[] = [
  {
    id: 'shift-prev-101',
    cashierName: 'Budi Kasir (Pagi)',
    startTime: new Date(Date.now() - 3600000 * 10).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'CLOSED',
    startingCash: 200000,
    expectedCash: 850000,
    actualEndingCash: 850000,
    differenceAmount: 0,
    differenceStatus: 'PAS',
    totalCashSales: 650000,
    totalNonCashSales: 420000,
    totalSales: 1070000,
    totalOrdersCount: 14,
    notes: 'Shift Pagi Lancar, Uang Pas.',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

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

    currentActiveShift = newShift;

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
