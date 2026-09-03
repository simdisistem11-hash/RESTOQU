import { EventEmitter } from 'events';

// Create a global event emitter instance that survives hot reloads in development
const globalForEvents = globalThis as unknown as {
  eventEmitter: EventEmitter | undefined;
};

export const eventEmitter = globalForEvents.eventEmitter ?? new EventEmitter();

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.eventEmitter = eventEmitter;
}

// Increase max listeners for multiple client connections
eventEmitter.setMaxListeners(200);

export type RestoEvent = {
  type: 'ORDER_CREATED' | 'ORDER_STATUS_CHANGED' | 'WAITER_REQUESTED' | 'PAYMENT_COMPLETED';
  tenantId: string;
  data: any;
  timestamp: string;
};

export function broadcastEvent(event: RestoEvent) {
  eventEmitter.emit('resto_event', event);
}
