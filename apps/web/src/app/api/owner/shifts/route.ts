import { NextResponse } from 'next/server';
import { shiftHistory } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let filtered = [...shiftHistory];

    if (startDateParam) {
      const start = new Date(startDateParam);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(s => new Date(s.createdAt) >= start);
    }

    if (endDateParam) {
      const end = new Date(endDateParam);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(s => new Date(s.createdAt) <= end);
    }

    const totalSetoranFisik = filtered.reduce((sum, s) => sum + (s.actualEndingCash || 0), 0);
    const totalOmsetNonTunai = filtered.reduce((sum, s) => sum + (s.totalNonCashSales || 0), 0);
    const totalSelisih = filtered.reduce((sum, s) => sum + (s.differenceAmount || 0), 0);

    return NextResponse.json({
      success: true,
      shifts: filtered,
      summary: {
        totalShifts: filtered.length,
        totalSetoranFisik,
        totalOmsetNonTunai,
        totalSelisih
      }
    });
  } catch (error) {
    console.error('[API Owner Shifts GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data laporan shift owner' }, { status: 500 });
  }
}
