import { NextResponse } from 'next/server';
import { prisma } from '@restoqu/database';

export async function POST(req: Request) {
  try {
    const { sessionId, name, deviceToken } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID wajib diisi' }, { status: 400 });
    }

    const session = await prisma.servicePointSession.findUnique({
      where: { id: sessionId },
      include: { participants: true }
    });

    if (!session || session.status === 'CLOSED') {
      return NextResponse.json({ error: 'Session tidak aktif atau sudah ditutup' }, { status: 400 });
    }

    const isHost = session.participants.length === 0;
    const participantName = name || `Guest #${session.participants.length + 1}`;

    const participant = await prisma.participant.create({
      data: {
        sessionId: session.id,
        name: participantName,
        deviceToken: deviceToken || null,
        isHost,
        cart: {
          create: {
            sessionId: session.id
          }
        }
      },
      include: {
        cart: true
      }
    });

    return NextResponse.json({
      success: true,
      participant: {
        id: participant.id,
        name: participant.name,
        isHost: participant.isHost,
        sessionId: session.id
      }
    });

  } catch (err: any) {
    console.error('Session join error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
