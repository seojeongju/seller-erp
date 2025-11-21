"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { apiClient, apiClientMutation } from "@/lib/api";

interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  attributes?: Record<string, any>;
  price: number;
  cost?: number;
  quantity: number;
  trackSerialNumbers: boolean;
}

interface ProductVariantManagerProps {
  productId: string;
  variants: ProductVariant[];
  onVariantChange: () => void;
}

export function ProductVariantManager({
  productId,
  variants: initialVariants,
  onVariantChange,
}: ProductVariantManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [editingId, setEditingId] = useState<string | null>(null);

  // initialVariants가 변경되면 variants 업데이트
  useEffect(() => {
    setVariants(initialVariants);
  }, [initialVariants]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<ProductVariant>>({
    name: "",
    sku: "",
    price: 0,
    cost: 0,
    quantity: 0,
    trackSerialNumbers: false,
    attributes: {},
  });

  const handleCreate = async () => {
    if (!formData.name || !formData.price) {
      setError("옵션명과 가격을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClientMutation(`/api/products/${productId}/variants`, "POST", {
        name: formData.name,
        sku: formData.sku,
        price: formData.price,
        cost: formData.cost,
        quantity: formData.quantity || 0,
        trackSerialNumbers: formData.trackSerialNumbers || false,
        attributes: formData.attributes || {},
      });

      setFormData({
        name: "",
        sku: "",
        price: 0,
        cost: 0,
        quantity: 0,
        trackSerialNumbers: false,
        attributes: {},
      });
      setShowForm(false);
      onVariantChange();
    } catch (err: any) {
      setError(err.message || "옵션 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (variantId: string) => {
    if (!formData.name || !formData.price) {
      setError("옵션명과 가격을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClientMutation(`/api/products/variants/${variantId}`, "PATCH", {
        name: formData.name,
        sku: formData.sku,
        price: formData.price,
        cost: formData.cost,
        quantity: formData.quantity,
        trackSerialNumbers: formData.trackSerialNumbers,
        attributes: formData.attributes,
      });

      setEditingId(null);
      setFormData({
        name: "",
        sku: "",
        price: 0,
        cost: 0,
        quantity: 0,
        trackSerialNumbers: false,
        attributes: {},
      });
      onVariantChange();
    } catch (err: any) {
      setError(err.message || "옵션 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (variantId: string) => {
    if (!confirm("정말 이 옵션을 삭제하시겠습니까?")) {
      return;
    }

    setLoading(true);
    try {
      await apiClientMutation(`/api/products/variants/${variantId}`, "DELETE");
      onVariantChange();
    } catch (err: any) {
      setError(err.message || "옵션 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (variant: ProductVariant) => {
    setEditingId(variant.id);
    setFormData({
      name: variant.name,
      sku: variant.sku || "",
      price: variant.price,
      cost: variant.cost || 0,
      quantity: variant.quantity,
      trackSerialNumbers: variant.trackSerialNumbers,
      attributes: variant.attributes || {},
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: "",
      sku: "",
      price: 0,
      cost: 0,
      quantity: 0,
      trackSerialNumbers: false,
      attributes: {},
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">상품 옵션</h3>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>옵션 추가</span>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* 옵션 추가/수정 폼 */}
      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
          <h4 className="font-medium text-gray-900">
            {editingId ? "옵션 수정" : "새 옵션 추가"}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                옵션명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="예: 사이즈 7, 골드"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                value={formData.sku || ""}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                가격 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">원가</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost || 0}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">재고 수량</label>
              <input
                type="number"
                min="0"
                value={formData.quantity || 0}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="trackSerialNumbers"
                checked={formData.trackSerialNumbers || false}
                onChange={(e) => setFormData({ ...formData, trackSerialNumbers: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="trackSerialNumbers" className="ml-2 text-sm text-gray-700">
                시리얼 넘버 추적
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "저장 중..." : editingId ? "수정" : "추가"}
            </button>
          </div>
        </div>
      )}

      {/* 옵션 목록 */}
      {variants.length === 0 && !showForm ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600">등록된 옵션이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h5 className="font-medium text-gray-900">{variant.name}</h5>
                  {variant.sku && (
                    <span className="text-sm text-gray-500">SKU: {variant.sku}</span>
                  )}
                </div>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                  <span>가격: ₩{variant.price.toLocaleString()}</span>
                  {variant.cost && <span>원가: ₩{variant.cost.toLocaleString()}</span>}
                  <span>재고: {variant.quantity}개</span>
                  {variant.trackSerialNumbers && (
                    <span className="text-indigo-600">시리얼 추적</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => startEdit(variant)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(variant.id)}
                  disabled={loading}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

