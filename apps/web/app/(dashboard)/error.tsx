"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">대시보드 오류</h2>
          <p className="mt-4 text-gray-600">
            {error.message || "대시보드를 불러오는 중 문제가 발생했습니다."}
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-gray-400">오류 ID: {error.digest}</p>
          )}
        </div>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            다시 시도
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}

