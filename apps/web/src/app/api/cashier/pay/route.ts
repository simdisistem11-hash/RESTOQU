import { NextResponse } from 'next/server';
import { prisma, PaymentStatus, PaymentMethod } from '@restoqu/database';
import { deductStockForRecipeItem, initialRecipes } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const {
      orderId,
      orderNumber,
      method,
      cashierUserId,
      amountPaid,
      referenceNo,
      discountAmount = 0,
      customerPhone,
      customerName,
      pointsUsed = 0
    } = await request.json();

    if (!orderId && !orderNumber) {
      return NextResponse.json({ error: 'orderId atau orderNumber wajib diisi' }, { status: 400 });
    }

    if (!method) {
      return NextResponse.json({ error: 'Metode pembayaran wajib diisi' }, { status: 400 });
    }

    // 1. Find Order by ID or Order Number
    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { orderNumber: orderNumber },
      include: {
        tenant: { include: { settings: true } },
        servicePoint: true,
        items: {
          include: {
            product: true,
            modifiers: { include: { modifier: true } }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // 2. Handle Discount & Points calculation
    const pointsDiscount = pointsUsed * 100; // 1 point = Rp 100 discount
    const totalDiscount = Math.max(0, Number(discountAmount || 0) + pointsDiscount);
    const finalTotalAmount = Math.max(0, order.totalAmount - totalDiscount);

    // 3. Customer Loyalty Update / Registration
    let customer = null;
    let earnedPoints = 0;

    const phoneToUse = customerPhone || order.mainCustomerPhone;
    const nameToUse = customerName || order.mainCustomerName || 'Pelanggan';

    if (phoneToUse && phoneToUse.trim().length >= 9) {
      // Points earned: 1 point per Rp 10.000 spent
      earnedPoints = Math.floor(finalTotalAmount / 10000);

      customer = await prisma.customer.upsert({
        where: {
          tenantId_phone: {
            tenantId: order.tenantId,
            phone: phoneToUse.trim()
          }
        },
        create: {
          tenantId: order.tenantId,
          name: nameToUse.trim(),
          phone: phoneToUse.trim(),
          visitCount: 1,
          totalSpend: finalTotalAmount,
          points: earnedPoints
        },
        update: {
          name: nameToUse.trim(),
          visitCount: { increment: 1 },
          totalSpend: { increment: finalTotalAmount },
          points: { increment: earnedPoints - Number(pointsUsed || 0) }
        }
      });
    }

    // 4. Create Payment record
    const actualPaid = amountPaid !== undefined && amountPaid !== null ? Number(amountPaid) : finalTotalAmount;
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        method: method as PaymentMethod,
        amount: actualPaid,
        referenceNo: referenceNo || null,
        cashierUserId: cashierUserId || null
      }
    });

    // 5. Mark Order as PAID and update final total & discount
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: order.status === 'NEW' ? 'CONFIRMED' : order.status,
        discountAmount: totalDiscount,
        totalAmount: finalTotalAmount
      }
    });

    // 5b. Automatic Stock Deduction based on BOM Recipe
    if (order && order.items) {
      order.items.forEach(item => {
        const prodId = item.productId || item.product?.id;
        const qtyOrdered = item.quantity || 1;
        const recipe = initialRecipes[prodId] || [];
        recipe.forEach((r: any) => {
          deductStockForRecipeItem(r.ingredientName, r.quantityNeeded * qtyOrdered);
        });
      });
    }

    // 6. Build Receipt Printable Data & WA text format
    const changeAmount = Math.max(0, actualPaid - finalTotalAmount);
    
    const receiptData = {
      header: order.tenant.settings?.receiptHeader || order.tenant.name,
      footer: order.tenant.settings?.receiptFooter || 'Terima kasih atas kunjungan Anda!',
      orderNumber: order.orderNumber,
      date: new Date().toLocaleString('id-ID'),
      servicePointName: order.servicePoint?.displayName || 'Kasir / Direct',
      mainCustomerName: nameToUse,
      mainCustomerPhone: phoneToUse || '-',
      items: order.items.map(i => ({
        name: i.product.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
        modifiers: i.modifiers.map(m => m.modifier.name)
      })),
      subtotal: order.subtotal,
      serviceAmount: order.serviceAmount,
      taxAmount: order.taxAmount,
      discountAmount: totalDiscount,
      totalAmount: finalTotalAmount,
      paymentMethod: method,
      amountPaid: actualPaid,
      change: changeAmount,
      customerPoints: customer ? customer.points : null,
      earnedPoints
    };

    // Broadcast SSE Event
    try {
      const { broadcastEvent } = await import('@/lib/events');
      broadcastEvent({
        type: 'PAYMENT_COMPLETED',
        tenantId: order.tenantId,
        data: { order: updatedOrder, payment, receipt: receiptData },
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[SSE Broadcast Error]:', err);
    }

    return NextResponse.json({
      success: true,
      payment,
      order: updatedOrder,
      receipt: receiptData,
      customer
    });
  } catch (error) {
    console.error('[API Cashier Pay Error]:', error);
    return NextResponse.json({ error: 'Gagal memproses pembayaran' }, { status: 500 });
  }
}
