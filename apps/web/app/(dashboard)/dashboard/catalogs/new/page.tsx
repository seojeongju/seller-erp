"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiClientMutation } from "@/lib/api";
import { ImageUpload } from "@/components/products/image-upload";

export default function NewCatalogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        brand: "",
        imageUrls: [] as string[],
        defaultPrice: 0,
        specifications: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.name.trim()) {
            setError("상품명을 입력해주세요.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                defaultPrice: Number(formData.defaultPrice),
                specifications: formData.specifications
                    ? JSON.parse(formData.specifications)
                    : {},
            };

            await apiClientMutation("/api/catalogs", "POST", payload);
            router.push("/dashboard/catalogs");
        } catch (error: any) {
            console.error("Error creating catalog:", error);
            setError(error.message || "카탈로그 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/catalogs"
                    className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>카탈로그 목록으로 돌아가기</span>
                </Link>
                <h1 className="mt-4 text-3xl font-bold text-gray-900">새 카탈로그 등록</h1>
                <p className="text-gray-600 mt-2">상품의 기본 정보를 자세히 입력하세요.</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            상품명 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="예: 아이폰 15 Pro Max"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            상품 설명
                        </label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="상품에 대한 상세한 설명을 입력하세요."
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                카테고리
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">선택하세요</option>
                                <option value="의류">의류</option>
                                <option value="잡화">잡화</option>
                                <option value="전자제품">전자제품</option>
                                <option value="식품">식품</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                브랜드
                            </label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Apple, Samsung 등"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            상품 이미지
                        </label>
                        <ImageUpload
                            images={formData.imageUrls}
                            onChange={(urls) => setFormData({ ...formData, imageUrls: urls })}
                            maxImages={10}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            기준가 (참고용)
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="number"
                                value={formData.defaultPrice}
                                onChange={(e) => setFormData({ ...formData, defaultPrice: Number(e.target.value) })}
                                className="block w-full rounded-md border border-gray-300 pl-3 pr-12 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-500 sm:text-sm">원</span>
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">실제 판매가는 상품 등록 시 설정합니다.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            스펙 정보 (JSON)
                        </label>
                        <textarea
                            rows={3}
                            value={formData.specifications}
                            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                            placeholder='{"color": "블랙", "storage": "256GB"}'
                        />
                        <p className="mt-1 text-xs text-gray-500">JSON 형식으로 입력하세요. (선택사항)</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4">
                    <Link
                        href="/dashboard/catalogs"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        취소
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "등록 중..." : "카탈로그 등록"}
                    </button>
                </div>
            </form>
        </div>
    );
}
