import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get('tenantSlug') || 'bismillah-resto';

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        categories: {
          include: {
            products: {
              where: { isActive: true }
            }
          }
        }
      }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant tidak ditemukan' }, { status: 404 });
    }

    const categoriesList = tenant.categories.map(c => ({
      id: c.id,
      name: c.name
    }));

    const productsList: any[] = [];
    tenant.categories.forEach(c => {
      c.products.forEach(p => {
        productsList.push({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: p.price,
          category: c.name,
          categoryId: c.id,
          imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80'
        });
      });
    });

    return NextResponse.json({
      success: true,
      categories: [{ id: 'ALL', name: 'Semua Menu' }, ...categoriesList],
      products: productsList
    });

  } catch (err: any) {
    console.error('Fetch products error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
