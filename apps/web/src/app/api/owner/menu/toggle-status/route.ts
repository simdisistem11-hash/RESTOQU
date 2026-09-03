import { NextResponse } from 'next/server';
import { initialProducts } from '@/lib/store';
import { prisma } from '@restoqu/database';

export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID dan status wajib diisi' }, { status: 400 });
    }

    const idx = initialProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      initialProducts[idx].status = status;
    }

    try {
      await prisma.product.update({
        where: { id },
        data: { isActive: status === 'AVAILABLE' }
      });
    } catch (e) {
      // Prisma fallback
    }

    return NextResponse.json({
      success: true,
      id,
      status,
      message: `Status menu berhasil diubah menjadi ${status === 'AVAILABLE' ? 'Tersedia' : 'Stok Habis'}`
    });
  } catch (error) {
    console.error('[API Owner Menu Toggle Status Error]:', error);
    return NextResponse.json({ error: 'Gagal merubah status ketersediaan menu' }, { status: 500 });
  }
}
