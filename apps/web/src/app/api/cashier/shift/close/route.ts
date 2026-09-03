import { NextResponse } from 'next/server';
import { currentActiveShift, setCurrentActiveShift, shiftHistory } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const {
      actualEndingCash = 0,
      totalCashSales = 0,
      totalNonCashSales = 0,
      totalOrdersCount = 0,
      notes = ''
    } = await request.json();

    const startingCash = currentActiveShift ? currentActiveShift.startingCash : 200000;
    const expectedCash = startingCash + Number(totalCashSales);
    const actual = Number(actualEndingCash);
    const differenceAmount = actual - expectedCash;

    let differenceStatus = 'PAS';
    if (differenceAmount > 0) differenceStatus = 'SURPLUS';
    else if (differenceAmount < 0) differenceStatus = 'DEFICIT';

    const closedShift = {
      id: currentActiveShift ? currentActiveShift.id : `shift-${Date.now()}`,
      tenantId: currentActiveShift ? currentActiveShift.tenantId : 'bismillah-resto',
      cashierName: currentActiveShift ? currentActiveShift.cashierName : 'Kasir RestoQu',
      startTime: currentActiveShift ? currentActiveShift.startTime : new Date(Date.now() - 3600000 * 8).toISOString(),
      endTime: new Date().toISOString(),
      status: 'CLOSED',
      startingCash,
      expectedCash,
      actualEndingCash: actual,
      differenceAmount,
      differenceStatus,
      totalCashSales: Number(totalCashSales),
      totalNonCashSales: Number(totalNonCashSales),
      totalSales: Number(totalCashSales) + Number(totalNonCashSales),
      totalOrdersCount: Number(totalOrdersCount),
      notes: notes || 'Setoran kasir ditutup.',
      createdAt: new Date().toISOString()
    };

    shiftHistory.unshift(closedShift);
    setCurrentActiveShift(null);

    return NextResponse.json({
      success: true,
      shift: closedShift,
      message: 'Shift kasir berhasil ditutup'
    });
  } catch (error) {
    console.error('[API Cashier Shift Close Error]:', error);
    return NextResponse.json({ error: 'Gagal menutup shift kasir' }, { status: 500 });
  }
}
