import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일과 API 라우트는 제외
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  // 서브도메인 추출
  const hostname = request.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  // 개발 환경에서는 쿼리 파라미터로도 테넌트 슬러그를 받을 수 있음
  const tenantSlug =
    process.env.NODE_ENV === "development"
      ? request.nextUrl.searchParams.get("tenant") || subdomain
      : subdomain;

  // 랜딩 페이지나 인증 페이지는 테넌트 슬러그가 없어도 접근 가능
  if (pathname.startsWith("/auth") || pathname === "/") {
    return NextResponse.next();
  }

  // 대시보드 경로는 인증 필요
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      if (tenantSlug && tenantSlug !== "localhost") {
        signInUrl.searchParams.set("tenant", tenantSlug);
      }
      return NextResponse.redirect(signInUrl);
    }

    // 테넌트 슬러그를 헤더에 추가 (개발 환경에서는 토큰의 tenantSlug 사용)
    const response = NextResponse.next();
    response.headers.set("x-tenant-slug", token.tenantSlug as string);
    return response;
  }

  // 테넌트 슬러그를 헤더에 추가
  const response = NextResponse.next();
  if (tenantSlug && tenantSlug !== "localhost") {
    response.headers.set("x-tenant-slug", tenantSlug);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

