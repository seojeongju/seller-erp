"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { apiClient, apiClientMutation } from "@/lib/api";

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
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // API에서 고객 목록, 상품 목록 가져오기
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [customersData, productsData] = await Promise.all([
          apiClient<any[]>("/api/customers?page=1&limit=100"),
          apiClient<any[]>("/api/products?page=1&limit=100"),
        ]);
        setCustomers(Array.isArray(customersData) ? customersData : customersData?.data || []);
        setProducts(Array.isArray(productsData) ? productsData : productsData?.data || []);
      } catch (error: any) {
        console.error("Error loading data:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
    // 모든 상품의 variants를 찾아서 선택된 variant 찾기
    let foundVariant: any = null;
    let foundProduct: any = null;

    for (const product of products) {
      const variant = product.variants?.find((v: any) => v.id === variantId);
      if (variant) {
        foundVariant = variant;
        foundProduct = product;
        break;
      }
    }

    if (foundVariant && foundProduct) {
      setOrderItems(
        orderItems.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              variantId,
              productName: foundProduct.name,
              variantName: foundVariant.name,
              price: foundVariant.price,
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
    setSaving(true);
    setError("");

    // 폼 검증
    if (!customerId) {
      setError("고객을 선택해주세요.");
      setSaving(false);
      return;
    }

    if (orderItems.length === 0) {
      setError("최소 하나의 상품을 추가해주세요.");
      setSaving(false);
      return;
    }

    // 모든 아이템이 variantId를 가지고 있는지 확인
    const invalidItems = orderItems.filter((item) => !item.variantId);
    if (invalidItems.length > 0) {
      setError("모든 상품의 옵션을 선택해주세요.");
      setSaving(false);
      return;
    }

    try {
      const orderData = {
        customerId,
        items: orderItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      await apiClientMutation("/api/orders", "POST", orderData);
      const redirectUrl = tenant 
        ? `/dashboard/orders?tenant=${tenant}`
        : "/dashboard/orders";
      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Error creating order:", error);
      setError(error.message || "주문 생성에 실패했습니다.");
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
        <h1 className="mt-4 text-3xl font-bold text-gray-900">새 주문 생성</h1>
        <p className="text-gray-600 mt-2">고객 주문 정보를 입력하세요</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

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
                        {products.map((product) =>
                          product.variants?.map((variant: any) => (
                            <option key={variant.id} value={variant.id}>
                              {product.name} - {variant.name} (₩
                              {variant.price?.toLocaleString()})
                            </option>
                          ))
                        )}
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
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "생성 중..." : "주문 생성"}
          </button>
        </div>
      </form>
    </div>
  );
}

