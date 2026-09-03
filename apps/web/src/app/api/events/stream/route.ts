import { eventEmitter, RestoEvent } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial heartbeat
      controller.enqueue(encoder.encode(`: heartbeat\n\n`));

      const onEvent = (event: RestoEvent) => {
        // Filter by tenantId if provided
        if (!tenantId || event.tenantId === tenantId || event.tenantId === 'all') {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          try {
            controller.enqueue(encoder.encode(payload));
          } catch (err) {
            // Stream closed
          }
        }
      };

      eventEmitter.on('resto_event', onEvent);

      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (err) {
          clearInterval(interval);
          eventEmitter.off('resto_event', onEvent);
        }
      }, 15000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        eventEmitter.off('resto_event', onEvent);
        try {
          controller.close();
        } catch (err) {}
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
