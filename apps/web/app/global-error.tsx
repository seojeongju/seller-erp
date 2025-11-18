"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md text-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">오류가 발생했습니다</h2>
              <p className="mt-4 text-gray-600">
                {error.message || "애플리케이션에 문제가 발생했습니다."}
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => reset()}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

