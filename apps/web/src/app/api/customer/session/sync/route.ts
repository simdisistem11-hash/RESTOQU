import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const participantId = searchParams.get('participantId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID wajib diisi' }, { status: 400 });
    }

    const session = await prisma.servicePointSession.findUnique({
      where: { id: sessionId },
      include: {
        servicePoint: true,
        participants: {
          include: {
            cart: {
              include: {
                items: {
                  include: {
                    product: true
                  }
                }
              }
            }
          }
        },
        orders: {
          include: {
            items: {
              include: {
                product: true,
                modifiers: {
                  include: {
                    modifier: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session tidak ditemukan' }, { status: 404 });
    }

    // Aggregate shared session items & calculate prices server-side
    let sharedSessionSubtotal = 0;
    let sharedTotalItemsCount = 0;

    const aggregatedCartItems: any[] = [];

    session.participants.forEach(p => {
      if (p.cart && p.cart.items) {
        p.cart.items.forEach(item => {
          const itemTotal = item.product.price * item.quantity;
          sharedSessionSubtotal += itemTotal;
          sharedTotalItemsCount += item.quantity;

          aggregatedCartItems.push({
            id: item.id,
            participantId: p.id,
            participantName: p.name,
            productId: item.productId,
            productName: item.product.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
            totalPrice: itemTotal,
            notes: item.notes
          });
        });
      }
    });

    // Personal cart items for requested participantId
    const currentParticipant = session.participants.find(p => p.id === participantId);
    let personalCartItems: any[] = [];
    let personalSubtotal = 0;

    if (currentParticipant && currentParticipant.cart && currentParticipant.cart.items) {
      personalCartItems = currentParticipant.cart.items.map(it => {
        const itemTotal = it.product.price * it.quantity;
        personalSubtotal += itemTotal;
        return {
          id: it.id,
          productId: it.productId,
          productName: it.product.name,
          unitPrice: it.product.price,
          quantity: it.quantity,
          totalPrice: itemTotal,
          notes: it.notes
        };
      });
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        sessionCode: session.sessionCode,
        status: session.status,
        servicePointName: session.servicePoint.displayName,
        participantsCount: session.participants.length,
        participants: session.participants.map(p => ({ id: p.id, name: p.name, isHost: p.isHost }))
      },
      personalCart: {
        items: personalCartItems,
        subtotal: personalSubtotal
      },
      sharedCart: {
        items: aggregatedCartItems,
        totalItemsCount: sharedTotalItemsCount,
        subtotal: sharedSessionSubtotal
      },
      existingOrders: session.orders.map(ord => ({
        id: ord.id,
        orderNumber: ord.orderNumber,
        mainCustomerName: ord.mainCustomerName,
        status: ord.status,
        paymentStatus: ord.paymentStatus,
        totalAmount: ord.totalAmount,
        createdAt: ord.createdAt,
        items: ord.items.map(it => ({
          name: it.product.name,
          quantity: it.quantity,
          totalPrice: it.totalPrice,
          participantId: it.participantId
        }))
      }))
    });

  } catch (err: any) {
    console.error('Session sync error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
