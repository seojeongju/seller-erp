"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { OrderStatus } from "@seller-erp/types";

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number | string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    variant: {
      product: {
        name: string;
      };
    };
  }>;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "대기",
  PROCESSING: "처리중",
  COMPLETED: "완료",
  CANCELLED: "취소",
  REFUNDED: "환불",
};

function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(num);
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 주문</h2>
        <p className="text-gray-500 text-center py-8">주문이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">최근 주문</h2>
        <Link
          href="/dashboard/orders"
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          모두 보기 →
        </Link>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/dashboard/orders/${order.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {order.customer?.name || "고객 정보 없음"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(order.createdAt), "yyyy년 MM월 dd일 HH:mm", {
                    locale: ko,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(order.total)}
                </p>
                <p className="text-xs text-gray-500">
                  {order.items.length}개 품목
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

