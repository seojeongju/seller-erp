import Link from "next/link";
import { Plus } from "lucide-react";
import { apiServer } from "@/lib/api";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { Pagination } from "@/components/common/pagination";

interface ProductsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // URL 파라미터에서 검색 조건 추출
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 10;
  const search = searchParams.search || "";
  const category = searchParams.category || "";

  // API 쿼리 파라미터 구성
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) queryParams.set("search", search);
  if (category) queryParams.set("category", category);

  // API에서 상품 목록 가져오기
  let products: any[] = [];
  let pagination: any = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  try {
    const response = await apiServer<{ data: any[]; pagination: any }>(
      `/api/products?${queryParams.toString()}`
    );
    if (response?.data) {
      products = response.data;
      pagination = response.pagination || pagination;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
  }

  // 각 상품의 총 재고 수량 계산
  const productsWithQuantity = products.map((product) => {
    const totalQuantity = product.variants?.reduce(
      (sum: number, variant: any) => sum + (variant.quantity || 0),
      0
    ) || 0;
    return {
      ...product,
      totalQuantity,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">상품 관리</h1>
          <p className="text-gray-600 mt-2">상품을 등록하고 관리하세요</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>상품 등록</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <SearchInput
          placeholder="상품명, SKU로 검색..."
          paramName="search"
        />
        <FilterSelect
          options={[
            { value: "주얼리", label: "주얼리" },
            { value: "카메라", label: "카메라" },
            { value: "전자제품", label: "전자제품" },
          ]}
          paramName="category"
          placeholder="전체 카테고리"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                브랜드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                재고
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-sm">등록된 상품이 없습니다.</p>
                    <Link
                      href="/dashboard/products/new"
                      className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      첫 상품을 등록해보세요 →
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              productsWithQuantity.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500">{product.description}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {product.brand}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {product.totalQuantity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page || page}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.total || 0}
          itemsPerPage={pagination.limit || limit}
        />
      )}
    </div>
  );
}

