import { NextResponse } from 'next/server';
import { prisma, ServiceRequestType, RequestPriority, ServiceRequestStatus } from '@restoqu/database';

export async function POST(request: Request) {
  try {
    const { qrSecretKey, type, priority, notes } = await request.json();

    if (!qrSecretKey || !type) {
      return NextResponse.json({ error: 'Data permintaan tidak valid' }, { status: 400 });
    }

    // 1. Resolve Service Point
    const servicePoint = await prisma.servicePoint.findFirst({
      where: { qrSecretKey, isActive: true },
      include: { tenant: true, outlet: true }
    });

    if (!servicePoint) {
      return NextResponse.json({ error: 'Service Point tidak ditemukan' }, { status: 404 });
    }

    // 2. Resolve Active Session
    const session = await prisma.servicePointSession.findFirst({
      where: {
        servicePointId: servicePoint.id,
        status: { in: ['OPEN', 'ACTIVE', 'BILLING'] }
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Sesi meja tidak aktif' }, { status: 400 });
    }

    // 3. ANTI-SPAM LOCK CHECK
    const existingActiveRequest = await prisma.serviceRequest.findFirst({
      where: {
        servicePointId: servicePoint.id,
        status: { in: [ServiceRequestStatus.PENDING, ServiceRequestStatus.CLAIMED, ServiceRequestStatus.IN_PROGRESS] }
      }
    });

    if (existingActiveRequest) {
      return NextResponse.json({
        error: 'Pelayan sedang menuju meja Anda. Mohon tunggu sejenak.',
        request: existingActiveRequest
      }, { status: 409 });
    }

    // 4. Create Service Request
    const reqPriority = priority || (type === 'REQUEST_BILL' ? RequestPriority.HIGH : RequestPriority.NORMAL);

    const newRequest = await prisma.serviceRequest.create({
      data: {
        tenantId: servicePoint.tenantId,
        outletId: servicePoint.outletId,
        servicePointId: servicePoint.id,
        sessionId: session.id,
        type: type as ServiceRequestType,
        priority: reqPriority,
        status: ServiceRequestStatus.PENDING,
        notes: notes || null
      },
      include: {
        servicePoint: true
      }
    });

    // Broadcast SSE Event
    try {
      const { broadcastEvent } = await import('@/lib/events');
      broadcastEvent({
        type: 'WAITER_REQUESTED',
        tenantId: servicePoint.tenantId,
        data: newRequest,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[SSE Broadcast Error]:', err);
    }

    return NextResponse.json({
      success: true,
      request: newRequest
    });
  } catch (error) {
    console.error('[API Create Service Request Error]:', error);
    return NextResponse.json({ error: 'Gagal membuat permintaan pelayan' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenantSlug') || 'bismillah-resto';

    const requests = await prisma.serviceRequest.findMany({
      where: {
        status: { in: [ServiceRequestStatus.PENDING, ServiceRequestStatus.CLAIMED, ServiceRequestStatus.IN_PROGRESS] }
      },
      include: {
        servicePoint: true,
        session: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('[API Get Service Requests Error]:', error);
    return NextResponse.json({ error: 'Gagal memuat permintaan pelayan' }, { status: 500 });
  }
}
