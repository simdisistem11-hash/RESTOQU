import { NextResponse } from 'next/server';
import { prisma, OrderStatus } from '@restoqu/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantParam = searchParams.get('tenantId') || searchParams.get('tenantSlug') || 'bismillah-resto';

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: tenantParam },
          { slug: tenantParam }
        ]
      }
    });

    if (!tenant) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: {
        tenantId: tenant.id,
        status: { in: [OrderStatus.NEW, OrderStatus.CONFIRMED, OrderStatus.COOKING, OrderStatus.READY] }
      },
      include: {
        servicePoint: true,
        items: {
          include: {
            product: true,
            modifiers: { include: { modifier: true } }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('[API KDS GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data KDS' }, { status: 500 });
  }
}

