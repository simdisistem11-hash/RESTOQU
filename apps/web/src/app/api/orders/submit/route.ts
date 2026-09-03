import { NextResponse } from 'next/server';
import { prisma, OrderStatus, PaymentStatus } from '@restoqu/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrSecretKey, participantName, items } = body;

    if (!qrSecretKey || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap' }, { status: 400 });
    }

    // 1. Resolve Service Point & Active Session
    const servicePoint = await prisma.servicePoint.findFirst({
      where: { qrSecretKey, isActive: true },
      include: { tenant: { include: { settings: true } }, outlet: true }
    });

    if (!servicePoint || !servicePoint.tenant) {
      return NextResponse.json({ error: 'Service point tidak ditemukan' }, { status: 404 });
    }

    const { tenant, outlet } = servicePoint;

    const session = await prisma.servicePointSession.findFirst({
      where: {
        servicePointId: servicePoint.id,
        status: { in: ['OPEN', 'ACTIVE'] }
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Sesi meja tidak aktif. Silakan scan ulang QR.' }, { status: 400 });
    }

    // 2. Ensure Participant Record
    let participant = await prisma.participant.findFirst({
      where: { sessionId: session.id, name: participantName || 'Guest 1' }
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          sessionId: session.id,
          name: participantName || `Guest ${Math.floor(Math.random() * 100) + 1}`
        }
      });
    }

    // 3. SERVER-SIDE PRICE CALCULATION (Never trust client prices!)
    let calculatedSubtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!dbProduct || !dbProduct.isAvailable) {
        return NextResponse.json({ error: `Produk ${dbProduct?.name || ''} tidak tersedia` }, { status: 400 });
      }

      let itemUnitPrice = dbProduct.price;
      const selectedModifiers = [];

      if (item.modifierIds && Array.isArray(item.modifierIds) && item.modifierIds.length > 0) {
        const dbModifiers = await prisma.modifier.findMany({
          where: { id: { in: item.modifierIds } }
        });

        for (const mod of dbModifiers) {
          itemUnitPrice += mod.price;
          selectedModifiers.push({
            modifierId: mod.id,
            price: mod.price
          });
        }
      }

      const itemTotalPrice = itemUnitPrice * item.quantity;
      calculatedSubtotal += itemTotalPrice;

      processedItems.push({
        participantId: participant.id,
        productId: dbProduct.id,
        quantity: item.quantity,
        unitPrice: itemUnitPrice,
        totalPrice: itemTotalPrice,
        notes: item.notes || null,
        status: OrderStatus.NEW,
        modifiers: {
          create: selectedModifiers
        }
      });
    }

    // Tax & Service calculation
    const taxRate = tenant.settings?.taxPercentage ?? 10.0;
    const serviceRate = tenant.settings?.servicePercentage ?? 5.0;

    const serviceAmount = Math.round(calculatedSubtotal * (serviceRate / 100));
    const taxAmount = Math.round((calculatedSubtotal + serviceAmount) * (taxRate / 100));
    const totalAmount = calculatedSubtotal + serviceAmount + taxAmount;

    // Daily order number generation
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const dailyOrderCount = await prisma.order.count({
      where: {
        tenantId: tenant.id,
        createdAt: { gte: startOfDay }
      }
    });

    const orderNumber = `#${1001 + dailyOrderCount}`;

    // 4. Create Order Transaction
    const newOrder = await prisma.order.create({
      data: {
        tenantId: tenant.id,
        outletId: outlet.id,
        servicePointId: servicePoint.id,
        sessionId: session.id,
        orderNumber,
        subtotal: calculatedSubtotal,
        serviceAmount,
        taxAmount,
        discountAmount: 0,
        totalAmount,
        status: OrderStatus.NEW,
        paymentStatus: PaymentStatus.UNPAID,
        items: {
          create: processedItems
        }
      },
      include: {
        items: {
          include: {
            product: true,
            modifiers: { include: { modifier: true } }
          }
        }
      }
    });

    // Update Session status to ACTIVE
    if (session.status === 'OPEN') {
      await prisma.servicePointSession.update({
        where: { id: session.id },
        data: { status: 'ACTIVE' }
      });
    }

    // Broadcast SSE Event for real-time notification
    try {
      const { broadcastEvent } = await import('@/lib/events');
      broadcastEvent({
        type: 'ORDER_CREATED',
        tenantId: tenant.id,
        data: newOrder,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[SSE Broadcast Error]:', err);
    }

    return NextResponse.json({
      success: true,
      order: newOrder
    });
  } catch (error) {
    console.error('[API Submit Order Error]:', error);
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}
