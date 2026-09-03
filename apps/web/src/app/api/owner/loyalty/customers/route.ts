import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';
import { initialCustomers, getTierByPoints } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantParam = searchParams.get('tenantId') || 'bismillah-resto';

    let customersList: any[] = [];

    try {
      const dbCustomers = await prisma.customer.findMany({
        orderBy: { points: 'desc' }
      });

      if (dbCustomers && dbCustomers.length > 0) {
        customersList = dbCustomers.map(c => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email || '-',
          visitCount: c.visitCount,
          totalSpend: c.totalSpend,
          points: c.points,
          tierInfo: getTierByPoints(c.points),
          createdAt: c.createdAt
        }));
      }
    } catch (e) {
      // Fallback
    }

    if (customersList.length === 0) {
      customersList = initialCustomers.map(c => ({
        ...c,
        tierInfo: getTierByPoints(c.points)
      }));
    }

    // Summary statistics
    const totalMembers = customersList.length;
    const totalPoints = customersList.reduce((acc, c) => acc + (c.points || 0), 0);
    const tierCounts = {
      PLATINUM: customersList.filter(c => c.tierInfo.tier === 'PLATINUM').length,
      GOLD: customersList.filter(c => c.tierInfo.tier === 'GOLD').length,
      SILVER: customersList.filter(c => c.tierInfo.tier === 'SILVER').length,
      BRONZE: customersList.filter(c => c.tierInfo.tier === 'BRONZE').length
    };

    return NextResponse.json({
      success: true,
      customers: customersList,
      summary: {
        totalMembers,
        totalPoints,
        tierCounts
      }
    });
  } catch (error) {
    console.error('[API Owner Customers GET Error]:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pelanggan' }, { status: 500 });
  }
}
