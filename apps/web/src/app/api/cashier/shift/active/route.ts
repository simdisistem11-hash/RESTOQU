import { NextResponse } from 'next/server';

// In-memory store for shift state
const globalShifts: any[] = [];
let activeShift: any = null;

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      success: true,
      shift: activeShift
    });
  } catch (error) {
    console.error('[API Cashier Shift Active GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data shift aktif' }, { status: 500 });
  }
}

async function setActiveShiftData(shift: any) {
  activeShift = shift;
  if (shift) globalShifts.unshift(shift);
}

async function getGlobalShiftsData() {
  return globalShifts;
}
