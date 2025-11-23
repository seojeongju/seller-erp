"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { apiClientMutation } from "@/lib/api";

export default function BulkUploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [results, setResults] = useState<{
        success: number;
        failed: number;
        errors: string[];
    } | null>(null);

    const handleDownloadTemplate = () => {
        // CSV 템플릿 생성
        const headers = [
            "상품명*",
            "SKU*",
            "설명",
            "카테고리",
            "브랜드",
            "이미지URL1",
            "이미지URL2",
            "이미지URL3",
            "옵션명*",
            "옵션SKU",
            "판매가*",
            "원가",
            "재고수량*",
            "시리얼추적(Y/N)"
        ];

        const sampleData = [
            [
                "아이폰 15 Pro",
                "IPHONE-15-PRO",
                "최신 아이폰 15 Pro 모델",
                "전자제품",
                "Apple",
                "https://example.com/image1.jpg",
                "",
                "",
                "256GB, 블랙",
                "IPHONE-15-PRO-256-BLK",
                "1490000",
                "1200000",
                "50",
                "Y"
            ],
            [
                "아이폰 15 Pro",
                "IPHONE-15-PRO",
                "최신 아이폰 15 Pro 모델",
                "전자제품",
                "Apple",
                "https://example.com/image1.jpg",
                "",
                "",
                "512GB, 화이트",
                "IPHONE-15-PRO-512-WHT",
                "1790000",
                "1500000",
                "30",
                "Y"
            ]
        ];

        const csvContent = [
            headers.join(","),
            ...sampleData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "상품_대량등록_템플릿.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith(".csv")) {
                setError("CSV 파일만 업로드 가능합니다.");
                return;
            }
            setFile(selectedFile);
            setError("");
            setSuccess("");
            setResults(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("파일을 선택해주세요.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/products/bulk-upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("업로드에 실패했습니다.");
            }

            const result = await response.json();
            setResults(result);

            if (result.failed === 0) {
                setSuccess(`${result.success}개의 상품이 성공적으로 등록되었습니다.`);
            } else {
                setError(`${result.success}개 성공, ${result.failed}개 실패`);
            }
        } catch (err: any) {
            setError(err.message || "업로드 중 오류가 발생했습니다.");
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
                <h1 className="mt-4 text-3xl font-bold text-gray-900">상품 대량 등록</h1>
                <p className="text-gray-600 mt-2">CSV 파일을 업로드하여 여러 상품을 한 번에 등록하세요</p>
            </div>

            {/* Instructions */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="font-medium text-blue-900 mb-2">사용 방법</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>아래 "템플릿 다운로드" 버튼을 클릭하여 CSV 템플릿을 다운로드하세요</li>
                    <li>템플릿을 열어 상품 정보를 입력하세요 (* 표시는 필수 항목)</li>
                    <li>같은 상품의 여러 옵션은 여러 행으로 입력하세요</li>
                    <li>완성된 CSV 파일을 업로드하세요</li>
                </ol>
            </div>

            {/* Template Download */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="font-medium text-gray-900 mb-4">1. 템플릿 다운로드</h3>
                <button
                    onClick={handleDownloadTemplate}
                    className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                    <Download className="h-4 w-4" />
                    <span>템플릿 다운로드</span>
                </button>
            </div>

            {/* File Upload */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
                <h3 className="font-medium text-gray-900">2. CSV 파일 업로드</h3>

                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-12 h-12 mb-4 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">클릭하여 파일 선택</span> 또는 드래그 앤 드롭
                            </p>
                            <p className="text-xs text-gray-500">CSV 파일만 가능</p>
                            {file && (
                                <p className="mt-4 text-sm text-indigo-600 font-medium">{file.name}</p>
                            )}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {error && (
                    <div className="flex items-start space-x-2 rounded-lg border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                            {results && results.errors.length > 0 && (
                                <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                                    {results.errors.slice(0, 10).map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                    {results.errors.length > 10 && (
                                        <li>외 {results.errors.length - 10}개 오류...</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {success && (
                    <div className="flex items-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-medium text-green-800">{success}</p>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "업로드 중..." : "업로드 및 등록"}
                </button>
            </div>

            {/* Results */}
            {results && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="font-medium text-gray-900 mb-4">업로드 결과</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-green-50 p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">{results.success}</p>
                            <p className="text-sm text-green-800">성공</p>
                        </div>
                        <div className="rounded-lg bg-red-50 p-4 text-center">
                            <p className="text-2xl font-bold text-red-600">{results.failed}</p>
                            <p className="text-sm text-red-800">실패</p>
                        </div>
                    </div>
                    {results.success > 0 && (
                        <Link
                            href="/dashboard/products"
                            className="mt-4 block text-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            상품 목록 보기
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
