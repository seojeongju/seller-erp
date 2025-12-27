import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { D1Database } from "@cloudflare/workers-types";

// 글로벌 타입 확장 (Cloudflare Env)
declare global {
  var prisma: PrismaClient | undefined;
}

// Cloudflare Workers/Pages 환경 감지 및 D1 어댑터 설정
const createPrismaClient = () => {
  // @ts-ignore - Cloudflare Env는 런타임에 결정됨
  const d1 = typeof process !== "undefined" && process.env?.DB ? (process.env.DB as unknown as D1Database) : undefined;

  if (d1) {
    // Cloudflare 환경 (D1 사용)
    const adapter = new PrismaD1(d1);
    return new PrismaClient({ adapter });
  } else {
    // 로컬 환경 (SQLite 파일 사용)
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
};

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export * from "@prisma/client";
export * from "./middleware";


