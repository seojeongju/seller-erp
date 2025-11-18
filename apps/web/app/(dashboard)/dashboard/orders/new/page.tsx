"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";

interface OrderItem {
  id: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // TODO: API에서 고객 목록, 상품 목록 가져오기
  const customers = [
    { id: "1", name: "테스트 고객", email: "customer@test.com" },
  ];

  const products = [
    {
      id: "1",
      name: "테스트 상품",
      variants: [
        { id: "v1", name: "기본 옵션", price: 100000, stock: 10 },
        { id: "v2", name: "프리미엄 옵션", price: 200000, stock: 5 },
      ],
    },
  ];

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      variantId: "",
      productName: "",
      variantName: "",
      quantity: 1,
      price: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleVariantChange = (itemId: string, variantId: string) => {
    // TODO: 실제로는 API에서 variant 정보를 가져와야 함
    const variant = products[0].variants.find((v) => v.id === variantId);
    if (variant) {
      setOrderItems(
        orderItems.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              variantId,
              productName: products[0].name,
              variantName: variant.name,
              price: variant.price,
            };
          }
          return item;
        })
      );
    }
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      alert("고객을 선택해주세요.");
      return;
    }

    if (orderItems.length === 0) {
      alert("최소 하나의 상품을 추가해주세요.");
      return;
    }

    setLoading(true);

    try {
      // TODO: API 호출
      console.log("Creating order:", { customerId, orderItems });
      alert("주문이 생성되었습니다.");
      router.push("/dashboard/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("주문 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>주문 목록으로 돌아가기</span>
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">새 주문 생성</h1>
        <p className="text-gray-600 mt-2">고객 주문 정보를 입력하세요</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h2>
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
              고객 선택 <span className="text-red-500">*</span>
            </label>
            <select
              id="customer"
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">고객을 선택하세요</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">주문 상품</h2>
            <button
              type="button"
              onClick={addOrderItem}
              className="flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>상품 추가</span>
            </button>
          </div>

          {orderItems.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">
              주문할 상품을 추가해주세요
            </p>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        상품 옵션
                      </label>
                      <select
                        value={item.variantId}
                        onChange={(e) => handleVariantChange(item.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">선택하세요</option>
                        {products[0].variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {products[0].name} - {variant.name} (₩
                            {variant.price.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          수량
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateOrderItem(item.id, "quantity", parseInt(e.target.value))
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          소계
                        </label>
                        <div className="mt-1 flex h-10 items-center text-sm font-semibold text-gray-900">
                          ₩{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeOrderItem(item.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {orderItems.length > 0 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-lg font-semibold text-gray-900">총 금액</span>
              <span className="text-2xl font-bold text-indigo-600">
                ₩{totalAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/dashboard/orders"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "생성 중..." : "주문 생성"}
          </button>
        </div>
      </form>
    </div>
  );
}

