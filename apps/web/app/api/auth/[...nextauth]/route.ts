import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@seller-erp/db";
import * as bcrypt from "bcryptjs";
import { UserRole } from "@seller-erp/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantSlug: { label: "Tenant Slug", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.tenantSlug) {
          throw new Error("이메일, 비밀번호, 테넌트 슬러그를 모두 입력해주세요.");
        }

        // 테넌트 조회
        const tenant = await prisma.tenant.findUnique({
          where: { slug: credentials.tenantSlug },
        });

        if (!tenant) {
          throw new Error("테넌트를 찾을 수 없습니다.");
        }

        // 사용자 조회 (테넌트와 이메일로)
        const user = await prisma.user.findUnique({
          where: {
            tenantId_email: {
              tenantId: tenant.id,
              email: credentials.email,
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
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

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
        session.user.role = token.role as UserRole;
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

