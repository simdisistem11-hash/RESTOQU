import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';
import { initialStockItems, initialWasteLogs, deductStockForRecipeItem } from '@/lib/store';

export async function GET(request: Request) {
  try {
    try {
      const dbItems = await prisma.inventoryItem.findMany({
        include: { wastes: true }
      });
      if (dbItems && dbItems.length > 0) {
        const items = dbItems.map(i => ({
          id: i.id,
          name: i.name,
          category: 'Bahan Baku',
          sku: i.sku,
          quantity: i.currentStock,
          unit: i.unit,
          minStock: i.minStock,
          costPerUnit: i.costPerUnit
        }));
        return NextResponse.json({
          success: true,
          items,
          wastes: initialWasteLogs
        });
      }
    } catch (e) {
      // Prisma fallback
    }

    return NextResponse.json({
      success: true,
      items: initialStockItems,
      wastes: initialWasteLogs
    });
  } catch (error) {
    console.error('[API Owner Inventory GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data inventaris' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, category, quantity, unit, minStock, costPerUnit } = await request.json();
    const newItem = {
      id: `inv-${Date.now()}`,
      name,
      category: category || 'Bahan Utama',
      sku: `RM-${Date.now()}`,
      quantity: Number(quantity || 0),
      unit: unit || 'kg',
      minStock: Number(minStock || 5),
      costPerUnit: Number(costPerUnit || 0)
    };
    initialStockItems.unshift(newItem);
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal merubah data stok' }, { status: 500 });
  }
}
