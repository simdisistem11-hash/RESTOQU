import { NextResponse } from 'next/server';
import { initialStockItems, initialWasteLogs } from '../route';

export async function POST(request: Request) {
  try {
    const { itemName, quantity, reason } = await request.json();

    if (!itemName || !quantity) {
      return NextResponse.json({ error: 'Nama bahan dan jumlah wajib diisi' }, { status: 400 });
    }

    const qty = Number(quantity);
    const item = initialStockItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    const costPerUnit = item ? item.costPerUnit : 25000;
    const unit = item ? item.unit : 'pcs';
    const totalLoss = Math.round(costPerUnit * qty);

    if (item) {
      item.quantity = Math.max(0, item.quantity - qty);
    }

    const newWasteLog = {
      id: `w-${Date.now()}`,
      itemName,
      quantity: qty,
      unit,
      reason: reason || 'Kadaluarsa / Rusak',
      totalLoss,
      date: 'Hari Ini'
    };

    initialWasteLogs.unshift(newWasteLog);

    return NextResponse.json({
      success: true,
      waste: newWasteLog,
      message: `Berhasil mencatat waste ${itemName} ${qty} ${unit} (Kerugian: Rp${totalLoss.toLocaleString('id-ID')})`
    });
  } catch (error) {
    console.error('[API Owner Inventory Waste Error]:', error);
    return NextResponse.json({ error: 'Gagal mencatat transaksi waste' }, { status: 500 });
  }
}
