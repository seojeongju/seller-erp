import { PrismaClient } from "@prisma/client";

// 글로벌 타입 확장
declare global {
  var __prisma: PrismaClient | undefined;
}

// Lazy initialization - Prisma client is only created when first accessed
// This prevents build-time initialization errors in Edge Runtime
let _prisma: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (_prisma) return _prisma;

  // Check global cache first (for hot reloading in development)
  if (globalThis.__prisma) {
    _prisma = globalThis.__prisma;
    return _prisma;
  }

  // Create new client
  _prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  // Cache in global for development hot reloading
  if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma = _prisma;
  }

  return _prisma;
}

// Export as a getter that lazily initializes
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = client[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export * from "@prisma/client";
