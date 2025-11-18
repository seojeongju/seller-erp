"use client";

interface TopProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}

interface TopProductsProps {
  products: TopProduct[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

export function TopProducts({ products }: TopProductsProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">인기 상품</h2>
        <p className="text-gray-500 text-center py-8">데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">인기 상품 (Top 5)</h2>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.productId}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-bold">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.quantity.toLocaleString()}개 판매
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(product.revenue)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

