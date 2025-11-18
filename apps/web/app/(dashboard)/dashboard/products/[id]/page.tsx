"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // TODO: API에서 상품 데이터 가져오기
  const [formData, setFormData] = useState({
    name: "샘플 상품",
    sku: "PROD-001",
    description: "이것은 샘플 상품입니다",
    category: "주얼리",
    brand: "샘플 브랜드",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API 호출
      console.log("Updating product:", formData);
      alert("상품이 수정되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("상품 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 상품을 삭제하시겠습니까?")) {
      return;
    }

    setLoading(true);
    try {
      // TODO: API 호출
      console.log("Deleting product:", params.id);
      alert("상품이 삭제되었습니다.");
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("상품 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>상품 목록으로 돌아가기</span>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">상품 상세</h1>
            <p className="text-gray-600 mt-2">상품 정보를 확인하고 수정하세요</p>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleUpdate} className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              상품명
            </label>
            {isEditing ? (
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
              SKU
            </label>
            {isEditing ? (
              <input
                type="text"
                id="sku"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.sku}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              설명
            </label>
            {isEditing ? (
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                카테고리
              </label>
              {isEditing ? (
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="주얼리">주얼리</option>
                  <option value="카메라">카메라</option>
                  <option value="전자제품">전자제품</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{formData.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                브랜드
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{formData.brand}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

