import { PrismaClient } from "@seller-erp/db";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

export function getDbClient() {
    // 개발 환경에서는 로컬 DB 연결 (패키지에서 내보낸 기본 클라이언트 사용)
    if (process.env.NODE_ENV === "development") {
        // 동적 import로 빌드 타임 의존성 최소화
        const { prisma } = require("@seller-erp/db");
        return prisma as PrismaClient;
    }

    // Edge/Production 환경 (D1 바인딩 사용)
    try {
        const { env } = getRequestContext();
        if (env && (env as any).DB) {
            const adapter = new PrismaD1((env as any).DB);
            return new PrismaClient({ adapter: adapter as any });
        }
    } catch (e) {
        // getRequestContext가 없는 환경(빌드 타임 등)에서는 무시
    }

    // Fallback: D1 바인딩이 없거나 Local 환경이 아닌데 바인딩 실패 시
    // 기본 클라이언트 반환 (연결 실패할 수 있음)
    return new PrismaClient();
}
