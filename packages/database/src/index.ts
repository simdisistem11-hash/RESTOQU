import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

declare global {
  var prisma: PrismaClient | undefined;
}

export function createFreshPrismaClient(): PrismaClient {
  if (connectionString) {
    try {
      const pool = new Pool({
        connectionString,
        max: 5,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 10000
      });

      pool.on('error', (err) => {
        global.prisma = undefined;
      });

      const adapter = new PrismaNeon(pool);
      return new PrismaClient({ adapter } as any);
    } catch (e) {
      return new PrismaClient();
    }
  }
  return new PrismaClient();
}

function wrapWithAutoHeal(targetObj: any, rootPropName?: string): any {
  return new Proxy(targetObj, {
    get(target, propKey) {
      const val = target[propKey];
      if (typeof val === 'function') {
        return function (...args: any[]) {
          const result = val.apply(target, args);
          if (result && typeof result.then === 'function') {
            return result.catch(async (err: any) => {
              const isConnError =
                err?.message?.includes('Connection terminated') ||
                err?.message?.includes('Closed connection') ||
                err?.message?.includes('EngineState') ||
                err?.code === 'P1001' ||
                err?.code === 'P1002';

              if (isConnError) {
                console.warn('[Prisma Auto-Heal]: Reconnecting dead PgBouncer connection pool...');
                global.prisma = createFreshPrismaClient();
                const freshClient = global.prisma as any;
                const freshTarget = rootPropName ? freshClient[rootPropName] : freshClient;
                return freshTarget[propKey](...args);
              }
              throw err;
            });
          }
          return result;
        };
      } else if (val && typeof val === 'object' && !rootPropName) {
        return wrapWithAutoHeal(val, String(propKey));
      }
      return val;
    }
  });
}

const rawPrisma = global.prisma || createFreshPrismaClient();
if (process.env.NODE_ENV !== 'production') {
  global.prisma = rawPrisma;
}

export const prisma: PrismaClient = wrapWithAutoHeal(rawPrisma);

export * from '@prisma/client';
