import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import type { User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Helper function to get Prisma client with D1 at runtime
function getPrismaClient() {
    try {
        const { env } = getRequestContext();
        if (env?.DB) {
            const adapter = new PrismaD1(env.DB);
            return new PrismaClient({ adapter: adapter as any });
        }
    } catch {
        // Not in Cloudflare environment, use regular client
    }
    return new PrismaClient();
}

// Edge-compatible configuration
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                tenantSlug: { label: "Tenant Slug", type: "text" },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials?.password || !credentials?.tenantSlug) {
                    throw new Error("이메일, 비밀번호, 테넌트 슬러그를 모두 입력해주세요.");
                }

                const email = credentials.email as string;
                const password = credentials.password as string;
                const tenantSlug = credentials.tenantSlug as string;

                // Get Prisma client at runtime with D1 binding
                const prisma = getPrismaClient();

                try {
                    // 테넌트 조회
                    const tenant = await prisma.tenant.findUnique({
                        where: { slug: tenantSlug },
                    });

                    if (!tenant) {
                        throw new Error("테넌트를 찾을 수 없습니다.");
                    }

                    // 사용자 조회 (테넌트와 이메일로)
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
                        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
                    }

                    // 비밀번호 확인
                    const isPasswordValid = await bcrypt.compare(password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        tenantId: user.tenantId,
                        tenantSlug: tenant.slug,
                    };
                } finally {
                    await prisma.$disconnect();
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.tenantId = user.tenantId;
                token.tenantSlug = user.tenantSlug;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.tenantId = token.tenantId as string;
                session.user.tenantSlug = token.tenantSlug as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
    trustHost: true,
});
