"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { apiClient, apiClientMutation } from "@/lib/api";
import { ProductVariant, VariantManager } from "@/components/products/variant-manager";

export default function SimplifiedNewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [searchCatalog, setSearchCatalog] = useState("");
  const [selectedCatalog, setSelectedCatalog] = useState<any>(null);

  const [formData, setFormData] = useState({
    catalogId: "",
    price: 0,
    consumerPrice: 0,
    cost: 0,
    isTaxExempt: false,
    shippingType: "FREE",
    shippingFee: 0,
    isDisplayed: true,
    variants: [] as ProductVariant[],
  });

  // 카탈로그 검색
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchCatalog.length > 0) {
        try {
          const data = await apiClient<any>(`/api/catalogs?search=${searchCatalog}&limit=10`);
          setCatalogs(data.data);
        } catch (error) {
          console.error("Error searching catalogs:", error);
        }
      } else {
        setCatalogs([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchCatalog]);

  const handleSelectCatalog = (catalog: any) => {
    setSelectedCatalog(catalog);
    setFormData({
      ...formData,
      catalogId: catalog.id,
      price: catalog.defaultPrice || 0,
      consumerPrice: catalog.defaultPrice || 0,
    });
    setSearchCatalog("");
    setCatalogs([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedCatalog) {
      setError("카탈로그를 선택해주세요.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        catalogId: formData.catalogId,
        name: selectedCatalog.name,
        sku: `${selectedCatalog.id}-${Date.now()}`,
        description: selectedCatalog.description,
        category: selectedCatalog.category,
        brand: selectedCatalog.brand,
        imageUrls: selectedCatalog.imageUrls,
        price: Number(formData.price),
        consumerPrice: Number(formData.consumerPrice),
        cost: Number(formData.cost),
        isTaxExempt: formData.isTaxExempt,
        shippingType: formData.shippingType,
        shippingFee: Number(formData.shippingFee),
        isDisplayed: formData.isDisplayed,
        variants: formData.variants,
      };

      await apiClientMutation("/api/products", "POST", payload);
      router.push("/dashboard/products");
    } catch (error: any) {
      console.error("Error creating product:", error);
      setError(error.message || "상품 등록에 실패했습니다.");
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
        <h1 className="mt-4 text-3xl font-bold text-gray-900">판매 상품 등록</h1>
        <p className="text-gray-600 mt-2">카탈로그에서 상품을 선택하고 판매 조건을 설정하세요.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="max-w-3xl space-y-6">
        {/* Catalog Selection */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">1. 카탈로그 선택</h2>

          {!selectedCatalog ? (
            <div className="relative">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="카탈로그 검색..."
                  value={searchCatalog}
                  onChange={(e) => setSearchCatalog(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Search Results */}
              {catalogs.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                  {catalogs.map((catalog) => (
                    <button
                      key={catalog.id}
                      type="button"
                      onClick={() => handleSelectCatalog(catalog)}
                      className="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-left border-b last:border-b-0"
                    >
                      {catalog.imageUrls?.[0] ? (
                        <img
                          src={catalog.imageUrls[0]}
                          alt={catalog.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200" />
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{catalog.name}</div>
                        <div className="text-xs text-gray-500">{catalog.brand} / {catalog.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center">
                {selectedCatalog.imageUrls?.[0] ? (
                  <img
                    src={selectedCatalog.imageUrls[0]}
                    alt={selectedCatalog.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded bg-gray-200" />
                )}
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{selectedCatalog.name}</div>
                  <div className="text-sm text-gray-500">{selectedCatalog.description}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCatalog(null);
                  setFormData({ ...formData, catalogId: "" });
                }}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                변경
              </button>
            </div>
          )}
        </div>

        {/* Pricing */}
        {selectedCatalog && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">2. 가격 설정</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  판매가 <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="block w-full rounded-md border border-gray-300 pl-3 pr-12 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">원</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  정상가
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    value={formData.consumerPrice}
                    onChange={(e) => setFormData({ ...formData, consumerPrice: Number(e.target.value) })}
                    className="block w-full rounded-md border border-gray-300 pl-3 pr-12 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">원</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  원가
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="block w-full rounded-md border border-gray-300 pl-3 pr-12 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">원</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  배송비 유형
                </label>
                <select
                  value={formData.shippingType}
                  onChange={(e) => setFormData({ ...formData, shippingType: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="FREE">무료 배송</option>
                  <option value="FIXED">고정 배송비</option>
                  <option value="CONDITIONAL">조건부 무료</option>
                </select>
              </div>

              {formData.shippingType !== "FREE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    배송비
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      value={formData.shippingFee}
                      onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                      className="block w-full rounded-md border border-gray-300 pl-3 pr-12 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">원</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="isTaxExempt"
                  type="checkbox"
                  checked={formData.isTaxExempt}
                  onChange={(e) => setFormData({ ...formData, isTaxExempt: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isTaxExempt" className="ml-2 block text-sm text-gray-900">
                  면세 상품
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="isDisplayed"
                  type="checkbox"
                  checked={formData.isDisplayed}
                  onChange={(e) => setFormData({ ...formData, isDisplayed: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isDisplayed" className="ml-2 block text-sm text-gray-900">
                  즉시 진열
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Variants */}
        {selectedCatalog && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">3. 옵션 설정 (선택)</h2>
            <VariantManager
              variants={formData.variants}
              onChange={(variants) => setFormData({ ...formData, variants })}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/dashboard/products"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedCatalog}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "등록 중..." : "상품 등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
