import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';

export let initialStockItems = [
  { id: 'inv-1', name: 'Beras Premium', category: 'Bahan Utama', sku: 'RM-BERAS-01', quantity: 50, unit: 'kg', minStock: 15, costPerUnit: 14000 },
  { id: 'inv-2', name: 'Daging Ayam Broiler', category: 'Protein', sku: 'RM-AYAM-01', quantity: 20, unit: 'kg', minStock: 10, costPerUnit: 38000 },
  { id: 'inv-3', name: 'Minyak Goreng', category: 'Bumbu & Minyak', sku: 'RM-MINYAK-01', quantity: 30, unit: 'liter', minStock: 10, costPerUnit: 18000 },
  { id: 'inv-4', name: 'Biji Kopi Arabika', category: 'Minuman', sku: 'RM-KOPI-01', quantity: 8, unit: 'kg', minStock: 3, costPerUnit: 120000 },
  { id: 'inv-5', name: 'Susu UHT Full Cream', category: 'Minuman', sku: 'RM-SUSU-01', quantity: 25, unit: 'liter', minStock: 8, costPerUnit: 18000 },
  { id: 'inv-6', name: 'Gula Aren Cair', category: 'Bumbu & Minyak', sku: 'RM-AREN-01', quantity: 10, unit: 'liter', minStock: 4, costPerUnit: 25000 },
  { id: 'inv-7', name: 'Tepung Tapioka Cireng', category: 'Bahan Utama', sku: 'RM-TEPUNG-01', quantity: 15, unit: 'kg', minStock: 5, costPerUnit: 12000 }
];

export let initialWasteLogs = [
  { id: 'w1', itemName: 'Daging Ayam Broiler', quantity: 1.5, unit: 'kg', reason: 'Kadaluarsa / Rusak Penyimpanan', totalLoss: 57000, date: '28 Aug 2026' },
  { id: 'w2', itemName: 'Susu UHT Full Cream', quantity: 2, unit: 'liter', reason: 'Bocor / Kemasan Kempes', totalLoss: 36000, date: '27 Aug 2026' }
];

export function deductStockForRecipeItem(ingredientName: string, qtyNeeded: number) {
  const item = initialStockItems.find(i => i.name.toLowerCase() === ingredientName.toLowerCase());
  if (item) {
    item.quantity = Math.max(0, Math.round((item.quantity - qtyNeeded) * 1000) / 1000);
    return item;
  }
  return null;
}

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
