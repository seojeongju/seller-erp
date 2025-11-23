"use client";

import { useState } from "react";
import { Plus, Minus, RotateCcw, X } from "lucide-react";
import { apiClientMutation } from "@/lib/api";

interface InventoryAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    variantId: string;
    currentQuantity: number;
    trackSerialNumbers: boolean;
}

export function InventoryAdjustmentModal({
    isOpen,
    onClose,
    onSuccess,
    variantId,
    currentQuantity,
    trackSerialNumbers,
}: InventoryAdjustmentModalProps) {
    const [adjustmentType, setAdjustmentType] = useState<"IN" | "OUT" | "ADJUST">("IN");
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!reason.trim()) {
            setError("조정 사유를 입력해주세요.");
            return;
        }

        if (trackSerialNumbers && adjustmentType === "IN" && !serialNumber.trim()) {
            setError("시리얼 넘버를 입력해주세요.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // 시리얼 넘버 추적 상품의 경우 입고 시 개별 아이템 생성 API 호출
            if (trackSerialNumbers && adjustmentType === "IN") {
                await apiClientMutation("/api/inventory/items", "POST", {
                    variantId,
                    serialNumber,
                    status: "AVAILABLE",
                });
            } else {
                // 일반 재고 조정
                const adjustment = {
                    variantId,
                    type: adjustmentType,
                    quantity: adjustmentType === "OUT" ? quantity : quantity, // 백엔드 로직에 따라 조정
                    reason,
                };
                await apiClientMutation("/api/inventory/adjust", "POST", adjustment);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "재고 조정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">재고 조정</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Adjustment Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            조정 유형
                        </label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setAdjustmentType("IN")}
                                className={`flex-1 flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${adjustmentType === "IN"
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <Plus className="h-4 w-4" />
                                <span>입고</span>
                            </button>
                            <button
                                onClick={() => setAdjustmentType("OUT")}
                                className={`flex-1 flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${adjustmentType === "OUT"
                                        ? "border-red-500 bg-red-50 text-red-700"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <Minus className="h-4 w-4" />
                                <span>출고</span>
                            </button>
                            {!trackSerialNumbers && (
                                <button
                                    onClick={() => setAdjustmentType("ADJUST")}
                                    className={`flex-1 flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${adjustmentType === "ADJUST"
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    <span>조정</span>
                                </button>
                            )}
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
                            disabled={trackSerialNumbers && adjustmentType === "IN"} // 시리얼 넘버 입력 시 1개씩만 가능하도록 (단순화)
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
                        />
                        {trackSerialNumbers && adjustmentType === "IN" && (
                            <p className="mt-1 text-xs text-gray-500">시리얼 넘버 추적 상품은 1개씩 입고됩니다.</p>
                        )}
                    </div>

                    {/* Serial Number (Only for tracked items on IN) */}
                    {trackSerialNumbers && adjustmentType === "IN" && (
                        <div>
                            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                                시리얼 넘버 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="serialNumber"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="시리얼 넘버 입력"
                            />
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                            사유 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="reason"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="재고 조정 사유를 입력하세요"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Preview */}
                    <div className="rounded-lg bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">현재 재고:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {currentQuantity}개
                            </span>
                        </div>
                        {!trackSerialNumbers && (
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-600">조정 후:</span>
                                <span className="text-sm font-bold text-indigo-600">
                                    {adjustmentType === "OUT"
                                        ? currentQuantity - quantity
                                        : adjustmentType === "IN"
                                            ? currentQuantity + quantity
                                            : quantity}
                                    개
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "처리 중..." : "확인"}
                    </button>
                </div>
            </div>
        </div>
    );
}
