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
  if (status) queryParams.set("status", status);
  if (search) queryParams.set("search", search);

  // API에서 재고 목록 가져오기
  let inventoryItems: any[] = [];

  try {
    const response: any = await apiServer<any>(
      `/api/inventory/items${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
    if (Array.isArray(response)) {
      inventoryItems = response;
    } else if (response?.data && Array.isArray(response.data)) {
      inventoryItems = response.data;
    }
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    inventoryItems = [];
  }

  // 통계 계산
  const totalQuantity = inventoryItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const inStockCount = inventoryItems.filter((item) => item.status === "IN_STOCK").length;
  const lowStockCount = inventoryItems.filter((item) => item.status === "LOW_STOCK").length;
  const outOfStockCount = inventoryItems.filter((item) => item.status === "OUT_OF_STOCK").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">재고 관리</h1>
          <p className="text-gray-600 mt-2">상품 재고를 실시간으로 관리하세요</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">총 재고 수량</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{totalQuantity}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">재고 있음</div>
          <div className="mt-1 text-2xl font-bold text-green-600">{inStockCount}</div>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center space-x-2 text-sm text-yellow-700">
            <AlertCircle className="h-4 w-4" />
            <span>재고 부족</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-yellow-700">{lowStockCount}</div>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center space-x-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>품절</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-red-700">{outOfStockCount}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <SearchInput
          placeholder="상품명, SKU, 시리얼 번호로 검색..."
          paramName="search"
        />
        <FilterSelect
          options={[
            { value: "IN_STOCK", label: "재고 있음" },
            { value: "LOW_STOCK", label: "재고 부족" },
            { value: "OUT_OF_STOCK", label: "품절" },
            { value: "RESERVED", label: "예약됨" },
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
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                시리얼 번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                수량
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {inventoryItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-sm">등록된 재고가 없습니다.</p>
                    <Link
                      href="/dashboard/products"
                      className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      상품을 먼저 등록해주세요 →
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              inventoryItems.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.variant?.product?.name}
                    </div>
                    <div className="text-sm text-gray-500">{item.variant?.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.variant?.sku}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.serialNumber || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        statusColors[item.status]
                      }`}
                    >
                      {statusLabels[item.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/inventory/${item.id}`}
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

      {/* Pagination - 재고는 페이지네이션이 필요할 수 있으므로 추가 */}
      {inventoryItems.length > limit && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(inventoryItems.length / limit)}
          totalItems={inventoryItems.length}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}

