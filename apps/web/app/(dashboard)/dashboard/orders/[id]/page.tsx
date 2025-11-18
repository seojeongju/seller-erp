"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { apiClient, apiClientMutation } from "@/lib/api";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "대기 중",
  CONFIRMED: "확인됨",
  PROCESSING: "처리 중",
  SHIPPED: "배송 중",
  DELIVERED: "배송 완료",
  CANCELLED: "취소됨",
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  // 주문 데이터 로드
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const orderData = await apiClient<any>(`/api/orders/${params.id}`);
        setOrder(orderData);
      } catch (error: any) {
        console.error("Error loading order:", error);
        setError("주문 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    setError("");

    try {
      await apiClientMutation(`/api/orders/${params.id}/status`, "PATCH", {
        status: newStatus,
      });
      // 주문 데이터 다시 로드
      const orderData = await apiClient<any>(`/api/orders/${params.id}`);
      setOrder(orderData);
    } catch (error: any) {
      console.error("Error updating order status:", error);
      setError(error.message || "주문 상태 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {error || "주문을 찾을 수 없습니다."}
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
          href={tenant ? `/dashboard/orders?tenant=${tenant}` : "/dashboard/orders"}
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>주문 목록으로 돌아가기</span>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">주문 상세</h1>
            <p className="text-gray-600 mt-2">주문 번호: {order.orderNumber}</p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              statusColors[order.status]
            }`}
          >
            {statusLabels[order.status]}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>주문 상품</span>
            </h2>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.variant?.product?.name || item.productName || "상품명 없음"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.variant?.name || item.variantName || "옵션 없음"}
                    </div>
                    <div className="text-sm text-gray-500">수량: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ₩{((item.price || item.variant?.price || 0) * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      단가: ₩{(item.price || item.variant?.price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-lg font-semibold text-gray-900">총 금액</span>
              <span className="text-2xl font-bold text-indigo-600">
                ₩{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status Update */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 상태 변경</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  disabled={saving || order.status === key}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    order.status === key
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">고객명</div>
                <div className="text-sm font-medium text-gray-900">{order.customer?.name || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">이메일</div>
                <div className="text-sm font-medium text-gray-900">{order.customer?.email || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">전화번호</div>
                <div className="text-sm font-medium text-gray-900">{order.customer?.phone || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 정보</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">주문 번호</div>
                <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">주문일시</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString("ko-KR")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

