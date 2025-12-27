import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { auth } from "@/auth";

export default async function middleware(request: NextRequest) {
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

  /**
   * [DEBUG] 500 에러 디버깅을 위해 인증 로직 임시 비활성화
   * Auth.js 초기화 문제로 추정되므로, 미들웨어에서 auth 감싸기를 제거함.
   */

  // if (pathname.startsWith("/dashboard")) {
  //   // 인증 체크 로직 임시 주석 처리
  //   // ...
  // }

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
