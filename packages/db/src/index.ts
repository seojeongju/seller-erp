export { PrismaClient } from "@prisma/client";
export * from "@prisma/client";
export * from "./middleware";

// Prisma Client 인스턴스 생성
// 각 앱에서 이 인스턴스를 재사용하거나, 필요에 따라 새로 생성할 수 있습니다.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

