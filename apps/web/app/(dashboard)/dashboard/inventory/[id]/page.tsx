"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, RotateCcw } from "lucide-react";

interface StockAdjustment {
  id: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason: string;
  createdAt: Date;
}

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"IN" | "OUT" | "ADJUST">("IN");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // TODO: API에서 재고 데이터 가져오기
  const inventory = {
    id: params.id,
    productName: "테스트 상품",
    variantName: "기본 옵션",
    sku: "PROD-001-V1",
    currentStock: 50,
    reorderPoint: 10,
    serialNumber: "SN-12345",
    history: [
      {
        id: "1",
        type: "IN" as const,
        quantity: 100,
        reason: "초기 입고",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        type: "OUT" as const,
        quantity: -30,
        reason: "주문 출고 (ORD-001)",
        createdAt: new Date("2024-01-20"),
      },
      {
        id: "3",
        type: "OUT" as const,
        quantity: -20,
        reason: "주문 출고 (ORD-002)",
        createdAt: new Date("2024-01-25"),
      },
    ],
  };

  const handleAdjustStock = async () => {
    if (!adjustmentReason.trim()) {
      alert("조정 사유를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // TODO: API 호출
      const adjustment = {
        inventoryId: params.id,
        type: adjustmentType,
        quantity:
          adjustmentType === "OUT" ? -adjustmentQuantity : adjustmentQuantity,
        reason: adjustmentReason,
      };

      console.log("Adjusting stock:", adjustment);
      alert("재고가 조정되었습니다.");
      setShowAdjustModal(false);
      setAdjustmentQuantity(1);
      setAdjustmentReason("");
      // router.refresh(); // 실제로는 데이터를 다시 가져와야 함
    } catch (error) {
      console.error("Error adjusting stock:", error);
      alert("재고 조정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "IN":
        return "입고";
      case "OUT":
        return "출고";
      case "ADJUST":
        return "조정";
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "IN":
        return "bg-green-100 text-green-800";
      case "OUT":
        return "bg-red-100 text-red-800";
      case "ADJUST":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            <p className="text-gray-600 mt-2">재고 정보 및 입출고 내역</p>
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
          {/* Stock History */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <RotateCcw className="h-5 w-5" />
              <span>입출고 내역</span>
            </h2>

            <div className="space-y-4">
              {inventory.history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTypeBadgeColor(
                          item.type
                        )}`}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          item.quantity > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.quantity > 0 ? "+" : ""}
                        {item.quantity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{item.reason}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleString("ko-KR")}
                    </div>
                  </div>
                </div>
              ))}
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
                {inventory.currentStock}
              </div>
              <div className="text-sm text-gray-500 mt-1">개</div>
              {inventory.currentStock <= inventory.reorderPoint && (
                <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ 재주문 필요 (최소 재고: {inventory.reorderPoint})
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
                  {inventory.productName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">옵션</div>
                <div className="text-sm font-medium text-gray-900">
                  {inventory.variantName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">SKU</div>
                <div className="text-sm font-medium text-gray-900">{inventory.sku}</div>
              </div>
              {inventory.serialNumber && (
                <div>
                  <div className="text-sm text-gray-500">시리얼 번호</div>
                  <div className="text-sm font-medium text-gray-900">
                    {inventory.serialNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">재고 조정</h3>

            <div className="space-y-4">
              {/* Adjustment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  조정 유형
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setAdjustmentType("IN")}
                    className={`flex-1 flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      adjustmentType === "IN"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span>입고</span>
                  </button>
                  <button
                    onClick={() => setAdjustmentType("OUT")}
                    className={`flex-1 flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      adjustmentType === "OUT"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                    <span>출고</span>
                  </button>
                  <button
                    onClick={() => setAdjustmentType("ADJUST")}
                    className={`flex-1 flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      adjustmentType === "ADJUST"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>조정</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  수량
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  사유
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="재고 조정 사유를 입력하세요"
                />
              </div>

              {/* Preview */}
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">현재 재고:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {inventory.currentStock}개
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">조정 후:</span>
                  <span className="text-sm font-bold text-indigo-600">
                    {adjustmentType === "OUT"
                      ? inventory.currentStock - adjustmentQuantity
                      : inventory.currentStock + adjustmentQuantity}
                    개
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAdjustStock}
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "처리 중..." : "재고 조정"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

