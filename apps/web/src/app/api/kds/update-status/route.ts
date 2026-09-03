import { NextResponse } from 'next/server';
import { prisma, OrderStatus } from '@restoqu/database';

export async function POST(request: Request) {
  try {
    const { orderId, newStatus } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'orderId dan newStatus wajib diisi' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus as OrderStatus },
      include: { servicePoint: true }
    });

    // If marked READY, update items status as well
    if (newStatus === OrderStatus.READY) {
      await prisma.orderItem.updateMany({
        where: { orderId },
        data: { status: OrderStatus.READY }
      });
    }

    // Broadcast SSE Event
    try {
      const { broadcastEvent } = await import('@/lib/events');
      broadcastEvent({
        type: 'ORDER_STATUS_CHANGED',
        tenantId: updatedOrder.tenantId,
        data: updatedOrder,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[SSE Broadcast Error]:', err);
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('[API KDS Update Status Error]:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status order' }, { status: 500 });
  }
}
