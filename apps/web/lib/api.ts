import { getSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 클라이언트 사이드 API 호출
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();
  const tenantSlug = session?.user?.tenantSlug || "";

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-tenant-slug": tenantSlug,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data || data;
}

// 서버 사이드 API 호출
export async function apiServer<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const session = await getServerSession(authOptions);
    const tenantSlug = session?.user?.tenantSlug || "";

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-tenant-slug": tenantSlug,
        ...options.headers,
      },
      cache: "no-store", // 서버 컴포넌트에서 항상 최신 데이터 가져오기
    });

    if (!response.ok) {
      // 404나 500 에러는 조용히 처리 (호출하는 쪽에서 catch로 처리)
      if (response.status === 404 || response.status >= 500) {
        throw new Error(`API error: ${response.status}`);
      }
      const error = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    // 네트워크 오류나 기타 에러는 다시 throw하여 호출하는 쪽에서 처리
    throw error;
  }
}

