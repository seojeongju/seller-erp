"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        // next-auth/react는 클라이언트 컴포넌트에서만 사용 가능
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        // 세션에서 tenantSlug 가져오기
        let tenantSlug = "";
        try {
          const sessionResponse = await fetch("/api/auth/session");
          if (sessionResponse.ok) {
            const session = await sessionResponse.json() as { user?: { tenantSlug?: string } };
            tenantSlug = session?.user?.tenantSlug || "";
          }
        } catch (e) {
          console.warn("Failed to get session:", e);
        }

        const response = await fetch(`${API_URL}/api/upload/image`, {
          method: "POST",
          headers: {
            "x-tenant-slug": tenantSlug,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "업로드 실패" })) as { message?: string };
          throw new Error(errorData.message || "이미지 업로드에 실패했습니다.");
        }

        const result = await response.json() as { url?: string; data?: { url?: string } };
        return result.url || result.data?.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => !!url);
      onChange([...images, ...validUrls]);
    } catch (err: any) {
      setError(err.message || "이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fakeEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        상품 이미지
      </label>

      {/* 드래그 앤 드롭 영역 */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-sm text-gray-600">업로드 중...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP, GIF (최대 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* 업로드된 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                {url.startsWith("http") || url.startsWith("/") ? (
                  <Image
                    src={url}
                    alt={`상품 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* URL 직접 입력 (선택사항) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          또는 이미지 URL 직접 입력
        </label>
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              e.preventDefault();
              if (images.length < maxImages) {
                onChange([...images, e.currentTarget.value.trim()]);
                e.currentTarget.value = "";
              } else {
                setError(`최대 ${maxImages}개의 이미지만 추가할 수 있습니다.`);
              }
            }
          }}
        />
      </div>
    </div>
  );
}

