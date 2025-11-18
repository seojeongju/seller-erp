import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md text-center">
        <div>
          <h1 className="text-6xl font-bold text-indigo-600">404</h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h2>
          <p className="mt-2 text-gray-600">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}

