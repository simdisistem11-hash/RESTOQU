import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';

export async function POST(req: Request) {
  try {
    const { tenantSlug, qrSecretKey } = await req.json();

    if (!tenantSlug || !qrSecretKey) {
      return NextResponse.json({ error: 'Tenant dan QR Key wajib diisi' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant restoran tidak ditemukan' }, { status: 404 });
    }

    const servicePoint = await prisma.servicePoint.findFirst({
      where: { tenantId: tenant.id, qrSecretKey }
    });

    if (!servicePoint) {
      return NextResponse.json({ error: 'Service point / QR Code tidak ditemukan atau tidak aktif' }, { status: 404 });
    }

    // Find active session for this service point
    let session = await prisma.servicePointSession.findFirst({
      where: {
        servicePointId: servicePoint.id,
        status: { in: ['OPEN', 'ACTIVE', 'CHECKOUT', 'ORDER_CREATED', 'BILLING'] }
      },
      include: {
        participants: true,
        orders: true
      }
    });

    let isNewSession = false;

    if (!session) {
      // Create new session
      session = await prisma.servicePointSession.create({
        data: {
          tenantId: tenant.id,
          outletId: servicePoint.outletId,
          servicePointId: servicePoint.id,
          sessionCode: `S${Date.now().toString().slice(-6)}`,
          status: 'ACTIVE'
        },
        include: {
          participants: true,
          orders: true
        }
      });
      isNewSession = true;
    }

    return NextResponse.json({
      success: true,
      isNewSession,
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
      servicePoint: { id: servicePoint.id, displayName: servicePoint.displayName, internalCode: servicePoint.internalCode },
      session: {
        id: session.id,
        sessionCode: session.sessionCode,
        status: session.status,
        participantsCount: session.participants.length,
        ordersCount: session.orders.length
      }
    });

  } catch (err: any) {
    console.error('Session get-or-create error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
