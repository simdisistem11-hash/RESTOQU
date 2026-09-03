import { NextResponse } from 'next/server';
import { prisma, PaymentStatus } from '@restoqu/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantParam = searchParams.get('tenantId') || searchParams.get('tenantSlug') || 'bismillah-resto';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const paymentMethodParam = searchParams.get('paymentMethod');
    const searchQuery = searchParams.get('search')?.trim().toLowerCase();

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: tenantParam },
          { slug: tenantParam }
        ]
      }
    });

    if (!tenant) {
      return NextResponse.json({
        success: true,
        orders: [],
        summary: { totalRevenue: 0, totalTransactions: 0, averageTransaction: 0 }
      });
    }

    // Build date filter
    const dateFilter: any = {};
    if (startDateParam || endDateParam) {
      dateFilter.createdAt = {};
      if (startDateParam) {
        const start = new Date(startDateParam);
        start.setHours(0, 0, 0, 0);
        dateFilter.createdAt.gte = start;
      }
      if (endDateParam) {
        const end = new Date(endDateParam);
        end.setHours(23, 59, 59, 999);
        dateFilter.createdAt.lte = end;
      }
    }

    const whereCondition: any = {
      tenantId: tenant.id,
      paymentStatus: PaymentStatus.PAID,
      ...dateFilter
    };

    if (paymentMethodParam && paymentMethodParam !== 'ALL') {
      whereCondition.payments = {
        some: {
          method: paymentMethodParam
        }
      };
    }

    if (searchQuery) {
      whereCondition.OR = [
        { orderNumber: { contains: searchQuery, mode: 'insensitive' } },
        { mainCustomerName: { contains: searchQuery, mode: 'insensitive' } },
        { mainCustomerPhone: { contains: searchQuery, mode: 'insensitive' } },
        { servicePoint: { displayName: { contains: searchQuery, mode: 'insensitive' } } }
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: {
        servicePoint: true,
        payments: true,
        items: {
          include: {
            product: true,
            modifiers: { include: { modifier: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalTransactions = orders.length;
    const averageTransaction = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

    return NextResponse.json({
      success: true,
      orders,
      summary: {
        totalRevenue,
        totalTransactions,
        averageTransaction
      }
    });
  } catch (error) {
    console.error('[API Cashier History GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data riwayat transaksi' }, { status: 500 });
  }
}
