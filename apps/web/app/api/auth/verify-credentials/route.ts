import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@seller-erp/db";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import * as bcrypt from "bcryptjs";

export const runtime = "edge";

interface CredentialsBody {
    email: string;
    password: string;
    tenantSlug: string;
}

// Helper function to get Prisma client with D1 at runtime
function getPrismaClient() {
    try {
        const { env } = getRequestContext();
        if ((env as any)?.DB) {
            const adapter = new PrismaD1((env as any).DB);
            return new PrismaClient({ adapter: adapter as any });
        }
    } catch {
        // Not in Cloudflare environment
    }
    return new PrismaClient();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as CredentialsBody;
        const { email, password, tenantSlug } = body;

        if (!email || !password || !tenantSlug) {
            return NextResponse.json(
                { message: "이메일, 비밀번호, 테넌트 슬러그를 모두 입력해주세요." },
                { status: 400 }
            );
        }

        const prisma = getPrismaClient();

        try {
            // 테넌트 조회
            const tenant = await prisma.tenant.findUnique({
                where: { slug: tenantSlug },
            });

            if (!tenant) {
                return NextResponse.json(
                    { message: "테넌트를 찾을 수 없습니다." },
                    { status: 401 }
                );
            }

            // 사용자 조회
            const user = await prisma.user.findUnique({
                where: {
                    tenantId_email: {
                        tenantId: tenant.id,
                        email: email,
                    },
                },
                include: {
                    tenant: true,
                },
            });

            if (!user) {
                return NextResponse.json(
                    { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
                    { status: 401 }
                );
            }

            // 비밀번호 확인
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return NextResponse.json(
                    { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
                    { status: 401 }
                );
            }

            // 성공 시 사용자 정보 반환
            return NextResponse.json({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
                tenantSlug: tenant.slug,
            });
        } finally {
            await prisma.$disconnect();
        }
    } catch (error) {
        console.error("Credential verification error:", error);
        const errorMessage = error instanceof Error ? error.message : "인증 중 오류가 발생했습니다.";
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}
