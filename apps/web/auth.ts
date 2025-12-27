import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { User } from "next-auth";

// Edge-compatible configuration (no direct Prisma import)
// Authentication logic is delegated to an API endpoint
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

                // Call internal API for authentication (which has access to D1)
                const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

                try {
                    const response = await fetch(`${baseUrl}/api/auth/verify-credentials`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                            tenantSlug: credentials.tenantSlug,
                        }),
                    });

                    if (!response.ok) {
                        const error = await response.json().catch(() => ({ message: "인증 실패" }));
                        throw new Error(error.message || "인증 실패");
                    }

                    const user = await response.json();
                    return user;
                } catch (error: any) {
                    throw new Error(error.message || "인증 중 오류가 발생했습니다.");
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
