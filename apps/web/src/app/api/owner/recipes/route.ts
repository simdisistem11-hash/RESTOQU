import { NextResponse } from 'next/server';
import { initialStockItems } from '../inventory/route';
import { initialProducts } from '../menu/route';

export let initialRecipes: { [productId: string]: any[] } = {
  p1: [
    { ingredientName: 'Beras Premium', quantityNeeded: 0.2, unit: 'kg' },
    { ingredientName: 'Daging Ayam Broiler', quantityNeeded: 0.05, unit: 'kg' },
    { ingredientName: 'Minyak Goreng', quantityNeeded: 0.02, unit: 'liter' }
  ],
  p2: [
    { ingredientName: 'Daging Ayam Broiler', quantityNeeded: 0.25, unit: 'kg' },
    { ingredientName: 'Beras Premium', quantityNeeded: 0.2, unit: 'kg' },
    { ingredientName: 'Minyak Goreng', quantityNeeded: 0.03, unit: 'liter' }
  ],
  p3: [
    { ingredientName: 'Biji Kopi Arabika', quantityNeeded: 0.018, unit: 'kg' },
    { ingredientName: 'Susu UHT Full Cream', quantityNeeded: 0.12, unit: 'liter' },
    { ingredientName: 'Gula Aren Cair', quantityNeeded: 0.025, unit: 'liter' }
  ],
  p4: [
    { ingredientName: 'Gula Aren Cair', quantityNeeded: 0.02, unit: 'liter' }
  ],
  p5: [
    { ingredientName: 'Tepung Tapioka Cireng', quantityNeeded: 0.15, unit: 'kg' },
    { ingredientName: 'Minyak Goreng', quantityNeeded: 0.05, unit: 'liter' }
  ]
};

export function calculateHppForProduct(productId: string) {
  const recipe = initialRecipes[productId] || [];
  let totalHpp = 0;
  recipe.forEach(item => {
    const inv = initialStockItems.find(i => i.name.toLowerCase() === item.ingredientName.toLowerCase());
    const costPerUnit = inv ? inv.costPerUnit : 15000;
    totalHpp += Math.round(costPerUnit * item.quantityNeeded);
  });
  return totalHpp;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      const items = initialRecipes[productId] || [];
      const hpp = calculateHppForProduct(productId);
      return NextResponse.json({
        success: true,
        productId,
        recipeItems: items,
        calculatedHpp: hpp
      });
    }

    const recipesList = initialProducts.map(p => {
      const items = initialRecipes[p.id] || [];
      const hpp = calculateHppForProduct(p.id);
      return {
        productId: p.id,
        productName: p.name,
        category: p.category,
        price: p.price,
        calculatedHpp: hpp || p.costPrice || 0,
        recipeItems: items
      };
    });

    return NextResponse.json({
      success: true,
      recipes: recipesList,
      stockItems: initialStockItems
    });
  } catch (error) {
    console.error('[API Owner Recipes GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data resep BOM' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, recipeItems } = await request.json();

    if (!productId || !Array.isArray(recipeItems)) {
      return NextResponse.json({ error: 'productId dan recipeItems wajib diisi' }, { status: 400 });
    }

    initialRecipes[productId] = recipeItems;

    const newHpp = calculateHppForProduct(productId);
    const prod = initialProducts.find(p => p.id === productId);
    if (prod) {
      prod.costPrice = newHpp;
    }

    return NextResponse.json({
      success: true,
      productId,
      recipeItems,
      calculatedHpp: newHpp,
      message: 'Resep BOM dan HPP berhasil diperbarui'
    });
  } catch (error) {
    console.error('[API Owner Recipes POST Error]:', error);
    return NextResponse.json({ error: 'Gagal menyimpan resep BOM' }, { status: 500 });
  }
}
