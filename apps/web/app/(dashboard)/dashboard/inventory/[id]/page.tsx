"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Package, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { InventoryAdjustmentModal } from "@/components/inventory/inventory-adjustment-modal";

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [variant, setVariant] = useState<any>(null);

  const loadVariantDetails = async () => {
    try {
      setLoading(true);
      const data = await apiClient<any>(`/api/inventory/variants/${params.id}`);
      setVariant(data);
    } catch (error: any) {
      console.error("Error loading variant details:", error);
      setError("재고 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVariantDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {error || "재고 정보를 찾을 수 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/inventory"
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>재고 목록으로 돌아가기</span>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">재고 상세</h1>
            <p className="text-gray-600 mt-2">
              {variant.product?.name} - {variant.name}
            </p>
          </div>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            재고 조정
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Serial Numbers Table (Only if tracked) */}
          {variant.trackSerialNumbers ? (
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>개별 재고 목록 (시리얼 넘버)</span>
                </h2>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      시리얼 넘버
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      입고일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {variant.inventoryItems?.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                        등록된 시리얼 넘버가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    variant.inventoryItems?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {item.serialNumber}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            {item.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">시리얼 넘버 미추적 상품</h3>
              <p className="mt-1 text-sm text-gray-500">
                이 상품 옵션은 수량으로만 관리되며, 개별 시리얼 넘버를 추적하지 않습니다.
              </p>
            </div>
          )}

          {/* History (Placeholder) */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <RotateCcw className="h-5 w-5" />
              <span>최근 활동 내역</span>
            </h2>
            <div className="text-sm text-gray-500 text-center py-8">
              아직 기록된 활동 내역이 없습니다.
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Stock */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">현재 재고</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">
                {variant.quantity || 0}
              </div>
              <div className="text-sm text-gray-500 mt-1">개</div>

              {variant.quantity <= 10 && (
                <div className="mt-4 rounded-lg bg-yellow-50 p-3 flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-xs text-yellow-800 text-left">
                    재고가 부족합니다. (10개 이하)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">상품 정보</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">상품명</div>
                <div className="text-sm font-medium text-gray-900">
                  {variant.product?.name || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">옵션명</div>
                <div className="text-sm font-medium text-gray-900">
                  {variant.name || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">SKU</div>
                <div className="text-sm font-medium text-gray-900">
                  {variant.sku || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">판매가</div>
                <div className="text-sm font-medium text-gray-900">
                  {parseInt(variant.price).toLocaleString()}원
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InventoryAdjustmentModal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        onSuccess={() => {
          loadVariantDetails();
        }}
        variantId={variant.id}
        currentQuantity={variant.quantity}
        trackSerialNumbers={variant.trackSerialNumbers}
      />
    </div>
  );
}

