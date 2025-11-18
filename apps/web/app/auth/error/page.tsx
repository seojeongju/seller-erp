"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    tenant_mismatch: "테넌트가 일치하지 않습니다.",
    Configuration: "서버 설정 오류가 발생했습니다.",
    AccessDenied: "접근이 거부되었습니다.",
    Verification: "인증 토큰이 만료되었거나 유효하지 않습니다.",
    default: "인증 중 오류가 발생했습니다.",
  };

  const message = errorMessages[error || ""] || errorMessages.default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md text-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">오류</h2>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
        <div>
          <Link
            href="/auth/signin"
            className="text-indigo-600 hover:text-indigo-500"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

