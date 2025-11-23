"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export interface ProductVariant {
    id?: string;
    name: string;
    sku: string;
    price: number;
    cost?: number;
    quantity: number;
    attributes: Record<string, string>;
    trackSerialNumbers: boolean;
}

interface VariantManagerProps {
    variants: ProductVariant[];
    onChange: (variants: ProductVariant[]) => void;
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<ProductVariant>({
        name: "",
        sku: "",
        price: 0,
        cost: 0,
        quantity: 0,
        attributes: {},
        trackSerialNumbers: false,
    });

    const handleAddVariant = () => {
        if (editingIndex !== null) {
            // 수정 모드
            const updated = [...variants];
            updated[editingIndex] = formData;
            onChange(updated);
            setEditingIndex(null);
        } else {
            // 추가 모드
            onChange([...variants, formData]);
        }

        // 폼 초기화
        setFormData({
            name: "",
            sku: "",
            price: 0,
            cost: 0,
            quantity: 0,
            attributes: {},
            trackSerialNumbers: false,
        });
        setShowForm(false);
    };

    const handleEditVariant = (index: number) => {
        setFormData(variants[index]);
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleDeleteVariant = (index: number) => {
        const updated = variants.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleCancel = () => {
        setFormData({
            name: "",
            sku: "",
            price: 0,
            cost: 0,
            quantity: 0,
            attributes: {},
            trackSerialNumbers: false,
        });
        setEditingIndex(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">상품 옵션</h3>
                    <p className="text-sm text-gray-500">
                        사이즈, 색상 등 다양한 옵션을 추가하세요
                    </p>
                </div>
                {!showForm && (
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        <span>옵션 추가</span>
                    </button>
                )}
            </div>

            {/* Variant Form */}
            {showForm && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                옵션명 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="예: 사이즈 7, 골드"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                SKU <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="PROD-001-S-GOLD"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                판매가 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                원가
                            </label>
                            <input
                                type="number"
                                value={formData.cost || 0}
                                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                재고 수량 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                min="0"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="trackSerialNumbers"
                            checked={formData.trackSerialNumbers}
                            onChange={(e) => setFormData({ ...formData, trackSerialNumbers: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="trackSerialNumbers" className="ml-2 block text-sm text-gray-700">
                            시리얼 넘버 추적
                        </label>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={handleAddVariant}
                            disabled={!formData.name || !formData.sku || formData.price <= 0}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {editingIndex !== null ? "수정" : "추가"}
                        </button>
                    </div>
                </div>
            )}

            {/* Variants List */}
            {variants.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    옵션명
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    SKU
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    판매가
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    재고
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    작업
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {variants.map((variant, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                        {variant.name}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                        {variant.sku}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                                        ₩{variant.price.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-500">
                                        {variant.quantity}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                                        <button
                                            type="button"
                                            onClick={() => handleEditVariant(index)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            수정
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVariant(index)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-4 w-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {variants.length === 0 && !showForm && (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">
                        아직 등록된 옵션이 없습니다. 옵션을 추가해주세요.
                    </p>
                </div>
            )}
        </div>
    );
}
