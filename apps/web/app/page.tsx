import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="w-full max-w-2xl space-y-8 p-8 text-center">
        <div>
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src="/Logo.png"
              alt="WOW Seller ERP"
              width={120}
              height={120}
              className="h-auto w-auto"
              style={{ maxWidth: '120px', maxHeight: '120px' }}
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900">WOW Seller ERP</h1>
          <p className="mt-4 text-xl text-gray-600">
           빛나는 가치를 더 완벽하게 관리하는 법
          </p>
          <p className="text-xl text-gray-600">현대적인 멀티테넌시(Multi-tenancy) SaaS ERP 시스템</p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/signin?tenant=test-company"
            className="w-full rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 sm:w-auto"
          >
            로그인
          </Link>
          <Link
            href="/dashboard?tenant=test-company"
            className="w-full rounded-lg border-2 border-indigo-600 bg-white px-8 py-4 text-lg font-semibold text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-indigo-300 sm:w-auto"
          >
            대시보드 보기
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">📦</div>
            <h3 className="text-lg font-semibold text-gray-900">재고 관리</h3>
            <p className="mt-2 text-sm text-gray-600">
              실시간 재고 추적 및 시리얼 넘버 관리
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="text-lg font-semibold text-gray-900">판매 분석</h3>
            <p className="mt-2 text-sm text-gray-600">
              매출 통계 및 트렌드 분석 대시보드
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">👥</div>
            <h3 className="text-lg font-semibold text-gray-900">고객 관리</h3>
            <p className="mt-2 text-sm text-gray-600">
              고객 정보 및 주문 이력 통합 관리
            </p>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-gray-500">
            테스트 계정: admin@test.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
