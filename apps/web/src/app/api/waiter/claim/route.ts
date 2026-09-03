import { NextResponse } from 'next/server';
import { prisma, ServiceRequestStatus } from '@restoqu/database';

export async function POST(request: Request) {
  try {
    const { requestId, waiterUserId, action = 'claim' } = await request.json();

    if (!requestId) {
      return NextResponse.json({ error: 'requestId wajib diisi' }, { status: 400 });
    }

    if (action === 'complete') {
      const updated = await prisma.serviceRequest.update({
        where: { id: requestId },
        data: { status: ServiceRequestStatus.COMPLETED }
      });
      return NextResponse.json({ success: true, request: updated });
    }

    // Atomic claim check to prevent race condition
    let validUserId: string | null = null;
    if (waiterUserId) {
      const userExists = await prisma.user.findUnique({ where: { id: waiterUserId } });
      if (userExists) validUserId = userExists.id;
    }

    const updateResult = await prisma.serviceRequest.updateMany({
      where: {
        id: requestId,
        status: ServiceRequestStatus.PENDING
      },
      data: {
        status: ServiceRequestStatus.CLAIMED,
        ...(validUserId ? { assignedUserId: validUserId } : {})
      }
    });

    if (updateResult.count === 0) {
      return NextResponse.json({
        error: 'Permintaan ini sudah diambil oleh pelayan lain.'
      }, { status: 409 });
    }

    const claimedRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { servicePoint: true, assignedUser: true }
    });

    return NextResponse.json({
      success: true,
      request: claimedRequest
    });
  } catch (error) {
    console.error('[API Waiter Claim Error]:', error);
    return NextResponse.json({ error: 'Gagal mengklaim permintaan pelayan' }, { status: 500 });
  }
}
