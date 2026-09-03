import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';
import { initialCategories, initialProducts } from '@/lib/store';

export async function GET(request: Request) {
  try {
    try {
      const dbCategories = await prisma.category.findMany({
        include: { products: true }
      });

      if (dbCategories && dbCategories.length > 0) {
        const categoriesList = dbCategories.map(c => ({ id: c.id, name: c.name }));
        const productsList: any[] = [];
        dbCategories.forEach(c => {
          c.products.forEach(p => {
            productsList.push({
              id: p.id,
              name: p.name,
              description: p.description || '',
              price: p.price,
              costPrice: (p as any).costPrice || Math.round(p.price * 0.5),
              category: c.name,
              categoryId: c.id,
              status: p.isActive ? 'AVAILABLE' : 'SOLD_OUT',
              imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80',
              variants: []
            });
          });
        });

        return NextResponse.json({
          success: true,
          categories: categoriesList,
          products: productsList
        });
      }
    } catch (e) {
      // Prisma fallback
    }

    return NextResponse.json({
      success: true,
      categories: initialCategories,
      products: initialProducts
    });
  } catch (error) {
    console.error('[API Owner Menu GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data menu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, costPrice, category, imageUrl, status, variants } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Nama, harga, dan kategori wajib diisi' }, { status: 400 });
    }

    if (id) {
      const idx = initialProducts.findIndex(p => p.id === id);
      if (idx !== -1) {
        initialProducts[idx] = {
          ...initialProducts[idx],
          name,
          description: description || '',
          price: Number(price),
          costPrice: Number(costPrice || price * 0.5),
          category,
          imageUrl: imageUrl || initialProducts[idx].imageUrl,
          status: status || 'AVAILABLE',
          variants: variants || []
        };
      }
      return NextResponse.json({ success: true, product: initialProducts[idx] || body });
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        name,
        description: description || '',
        price: Number(price),
        costPrice: Number(costPrice || price * 0.5),
        category,
        categoryId: `cat-${Date.now()}`,
        status: status || 'AVAILABLE',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        variants: variants || []
      };
      initialProducts.unshift(newProd);

      if (!initialCategories.some(c => c.name.toLowerCase() === category.toLowerCase())) {
        initialCategories.push({ id: `cat-${Date.now()}`, name: category });
      }

      return NextResponse.json({ success: true, product: newProd });
    }
  } catch (error) {
    console.error('[API Owner Menu POST Error]:', error);
    return NextResponse.json({ error: 'Gagal menyimpan menu' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const idx = initialProducts.findIndex(p => p.id === id);
      if (idx !== -1) {
        initialProducts.splice(idx, 1);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus menu' }, { status: 500 });
  }
}
