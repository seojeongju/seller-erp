"use client";

interface SalesTrendData {
  dates: string[];
  sales: number[];
}

interface SalesTrendProps {
  data: SalesTrendData;
}

export function SalesTrend({ data }: SalesTrendProps) {
  if (data.dates.length === 0 || data.sales.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">판매 트렌드</h2>
        <p className="text-gray-500 text-center py-8">데이터가 없습니다</p>
      </div>
    );
  }

  const maxSales = Math.max(...data.sales, 1);
  const totalSales = data.sales.reduce((sum, val) => sum + val, 0);
  const averageSales = totalSales / data.sales.length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">판매 트렌드 (최근 30일)</h2>
      <div className="space-y-4">
        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">총 매출</p>
            <p className="text-xl font-bold text-gray-900">
              {new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
              }).format(totalSales)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">평균 일 매출</p>
            <p className="text-xl font-bold text-gray-900">
              {new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
              }).format(averageSales)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">최고 일 매출</p>
            <p className="text-xl font-bold text-gray-900">
              {new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
              }).format(maxSales)}
            </p>
          </div>
        </div>

        {/* 간단한 바 차트 */}
        <div className="mt-6">
          <div className="flex items-end gap-1 h-64">
            {data.sales.map((sales, index) => {
              const height = (sales / maxSales) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group relative"
                >
                  <div
                    className="w-full bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${data.dates[index]}: ${new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                    }).format(sales)}`}
                  />
                  {index % 5 === 0 && (
                    <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {data.dates[index].split("-")[2]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

