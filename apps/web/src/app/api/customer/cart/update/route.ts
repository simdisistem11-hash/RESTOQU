import { NextResponse } from 'next/server';
import { prisma, Prisma } from '@restoqu/database';

export async function POST(req: Request) {
  try {
    const { participantId, items } = await req.json();

    if (!participantId || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Participant ID dan Items wajib diisi' }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({
      where: { participantId },
      include: { items: true }
    });

    if (!cart) {
      const participant = await prisma.participant.findUnique({ where: { id: participantId } });
      if (!participant) {
        return NextResponse.json({ error: 'Participant tidak ditemukan' }, { status: 404 });
      }
      cart = await prisma.cart.create({
        data: {
          participantId,
          sessionId: participant.sessionId
        },
        include: { items: true }
      });
    }

    // Delete existing cart items and recreate
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    if (items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((it: any) => ({
          cartId: cart!.id,
          productId: it.productId,
          quantity: Number(it.quantity),
          notes: it.notes || null,
          modifiers: it.modifiers ? (typeof it.modifiers === 'string' ? it.modifiers : JSON.stringify(it.modifiers)) : Prisma.DbNull
        }))
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cart berhasil diperbarui'
    });

  } catch (err: any) {
    console.error('Cart update error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
