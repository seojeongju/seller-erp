"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { apiClient, apiClientMutation } from "@/lib/api";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    notes: "",
  });

  // 고객 데이터 로드
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setLoading(true);
        const customer = await apiClient<any>(`/api/customers/${params.id}`);
        setFormData({
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
          company: customer.company || "",
          address: customer.address || "",
          city: customer.city || "",
          state: customer.state || "",
          zipCode: customer.zipCode || "",
          country: customer.country || "",
          notes: customer.notes || "",
        });
      } catch (error: any) {
        console.error("Error loading customer:", error);
        setError("고객 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // 폼 검증
    if (!formData.name.trim()) {
      setError("고객명을 입력해주세요.");
      setSaving(false);
      return;
    }
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      setSaving(false);
      return;
    }

    try {
      await apiClientMutation(`/api/customers/${params.id}`, "PATCH", formData);
      setIsEditing(false);
      // 데이터 다시 로드
      const customer = await apiClient<any>(`/api/customers/${params.id}`);
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        company: customer.company || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zipCode: customer.zipCode || "",
        country: customer.country || "",
        notes: customer.notes || "",
      });
    } catch (error: any) {
      console.error("Error updating customer:", error);
      setError(error.message || "고객 정보 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 고객을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setSaving(true);
    try {
      await apiClientMutation(`/api/customers/${params.id}`, "DELETE");
      const redirectUrl = tenant 
        ? `/dashboard/customers?tenant=${tenant}`
        : "/dashboard/customers";
      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      setError(error.message || "고객 삭제에 실패했습니다.");
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
          href={tenant ? `/dashboard/customers?tenant=${tenant}` : "/dashboard/customers"}
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>고객 목록으로 돌아가기</span>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">고객 상세</h1>
            <p className="text-gray-600 mt-2">고객 정보를 확인하고 수정하세요</p>
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
                  disabled={saving}
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Content */}
      <form onSubmit={handleUpdate} className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              고객명
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{formData.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                전화번호
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{formData.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              회사명
            </label>
            {isEditing ? (
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.company}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              주소
            </label>
            {isEditing ? (
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="상세 주소"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.address || "N/A"}</p>
            )}
          </div>

          {isEditing && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  시/도
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  구/군
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  우편번호
                </label>
                <input
                  type="text"
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
          {!isEditing && (formData.city || formData.state || formData.zipCode) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                상세 주소
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {[formData.city, formData.state, formData.zipCode].filter(Boolean).join(" ")}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              메모
            </label>
            {isEditing ? (
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.notes}</p>
            )}
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
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

