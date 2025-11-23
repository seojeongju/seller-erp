import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { apiServer } from "@/lib/api";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { Pagination } from "@/components/common/pagination";

const statusColors: Record<string, string> = {
  IN_STOCK: "bg-green-100 text-green-800",
  LOW_STOCK: "bg-yellow-100 text-yellow-800",
  OUT_OF_STOCK: "bg-red-100 text-red-800",
  RESERVED: "bg-blue-100 text-blue-800",
};

const statusLabels: Record<string, string> = {
  IN_STOCK: "재고 있음",
  LOW_STOCK: "재고 부족",
  OUT_OF_STOCK: "품절",
  RESERVED: "예약됨",
};

interface InventoryPageProps {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
  };
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  // URL 파라미터에서 검색 조건 추출
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 10;
  const search = searchParams.search || "";
  const status = searchParams.status || "";

  // API 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());
  if (status) queryParams.set("status", status);
  if (search) queryParams.set("search", search);

  // API에서 재고 목록 가져오기 (ProductVariant 단위)
  let inventoryItems: any[] = [];
  let totalItems = 0;
  let totalPages = 1;

  try {
    const response: any = await apiServer<any>(
      `/api/inventory/variants${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );

    if (response?.data) {
      inventoryItems = response.data;
      totalItems = response.pagination?.total || 0;
      totalPages = response.pagination?.totalPages || 1;
    }
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    inventoryItems = [];
  }

  // 통계 계산 (현재 페이지 기준이 아닌 전체 통계 API가 별도로 필요하지만, 일단 현재 데이터로 표시하거나 숨김)
  // TODO: 전체 통계 API 구현 필요

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">재고 관리</h1>
          <p className="text-gray-600 mt-2">상품 옵션별 재고 현황을 확인하고 조정하세요</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <SearchInput
          placeholder="상품명, SKU로 검색..."
          paramName="search"
        />
        <FilterSelect
          options={[
            { value: "IN_STOCK", label: "재고 있음" },
            { value: "LOW_STOCK", label: "재고 부족 (10개 이하)" },
            { value: "OUT_OF_STOCK", label: "품절" },
          ]}
          paramName="status"
          placeholder="전체 상태"
        />
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                상품 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                옵션명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                현재 재고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                시리얼 추적
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {inventoryItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-sm">검색 결과가 없습니다.</p>
                  </div>
                </td>
              </tr>
            ) : (
              inventoryItems.map((item: any) => {
                let status = "IN_STOCK";
                if (item.quantity === 0) status = "OUT_OF_STOCK";
                else if (item.quantity <= 10) status = "LOW_STOCK";

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.sku || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[status]
                          }`}
                      >
                        {statusLabels[status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.trackSerialNumbers ? (
                        <span className="text-green-600 font-medium">사용</span>
                      ) : (
                        <span className="text-gray-400">미사용</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/inventory/${item.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > limit && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}

