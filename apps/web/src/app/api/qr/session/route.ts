import { NextResponse } from 'next/server';
import { prisma, ServicePointStatus, SessionStatus } from '@restoqu/database';

export async function POST(request: Request) {
  try {
    const { qrSecretKey } = await request.json();

    if (!qrSecretKey) {
      return NextResponse.json({ error: 'QR Secret Key tidak ditemukan' }, { status: 400 });
    }

    // 1. Resolve Service Point
    const servicePoint = await prisma.servicePoint.findFirst({
      where: { qrSecretKey, isActive: true },
      include: {
        tenant: {
          include: { settings: true }
        },
        outlet: true,
        type: true
      }
    });

    if (!servicePoint || !servicePoint.tenant) {
      return NextResponse.json({ error: 'QR Code tidak valid atau telah dinonaktifkan' }, { status: 404 });
    }

    const { tenant, outlet } = servicePoint;

    // 2. Find or Create Active Service Point Session (Concurrency & Transaction Safe)
    let session = await prisma.servicePointSession.findFirst({
      where: {
        servicePointId: servicePoint.id,
        status: { in: [SessionStatus.OPEN, SessionStatus.ACTIVE, SessionStatus.BILLING] }
      },
      include: {
        participants: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
                modifiers: { include: { modifier: true } }
              }
            }
          }
        }
      }
    });

    if (!session) {
      const sessionCount = await prisma.servicePointSession.count({ where: { tenantId: tenant.id } });
      const sessionCode = `S${1000 + sessionCount + 1}`;

      session = await prisma.servicePointSession.create({
        data: {
          tenantId: tenant.id,
          outletId: outlet.id,
          servicePointId: servicePoint.id,
          sessionCode,
          status: SessionStatus.OPEN
        },
        include: {
          participants: true,
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                  modifiers: { include: { modifier: true } }
                }
              }
            }
          }
        }
      });

      // Update Service Point status to OCCUPIED
      await prisma.servicePoint.update({
        where: { id: servicePoint.id },
        data: { status: ServicePointStatus.OCCUPIED }
      });
    }

    // 3. Fetch Tenant Categories & Menu Products with Modifiers
    const categories = await prisma.category.findMany({
      where: { tenantId: tenant.id },
      orderBy: { sortOrder: 'asc' },
      include: {
        products: {
          where: { isActive: true, isAvailable: true },
          include: {
            modifierGroups: {
              include: {
                modifierGroup: {
                  include: {
                    modifiers: {
                      where: { isAvailable: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // 4. Fetch Active Waiter Service Request for Table (for Anti-Spam lock check)
    const activeServiceRequest = await prisma.serviceRequest.findFirst({
      where: {
        servicePointId: servicePoint.id,
        status: { in: ['PENDING', 'CLAIMED', 'IN_PROGRESS'] }
      }
    });

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        logoUrl: tenant.logoUrl,
        coverImageUrl: tenant.coverImageUrl,
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
        currency: tenant.settings?.currency || 'IDR',
        taxPercentage: tenant.settings?.taxPercentage || 10.0,
        servicePercentage: tenant.settings?.servicePercentage || 5.0
      },
      servicePoint: {
        id: servicePoint.id,
        displayName: servicePoint.displayName,
        internalCode: servicePoint.internalCode,
        area: servicePoint.area,
        typeName: servicePoint.type.name
      },
      session: {
        id: session.id,
        sessionCode: session.sessionCode,
        status: session.status,
        participants: session.participants,
        orders: session.orders
      },
      categories,
      activeServiceRequest: activeServiceRequest ? {
        id: activeServiceRequest.id,
        type: activeServiceRequest.type,
        status: activeServiceRequest.status,
        createdAt: activeServiceRequest.createdAt
      } : null
    });
  } catch (error) {
    console.error('[API QR Session Error]:', error);
    return NextResponse.json({ error: 'Gagal memuat sesi QR' }, { status: 500 });
  }
}
