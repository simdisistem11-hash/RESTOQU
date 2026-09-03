import { NextResponse } from 'next/server';
import { initialStockItems, initialProducts, initialRecipes, calculateHppForProduct } from '@/lib/store';

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
