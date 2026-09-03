import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';
import { comparePassword, signJwtToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
        tenantId: true,
        outletId: true,
        tenant: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Kredensial tidak valid atau akun tidak aktif' }, { status: 401 });
    }

    const isMatch = comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      outletId: user.outletId
    };

    const token = signJwtToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenant?.name,
        tenantSlug: user.tenant?.slug,
        outletId: user.outletId
      },
      token
    });

    response.cookies.set('restoqu_token', token, {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    console.error('[API Auth Login Exception]:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
