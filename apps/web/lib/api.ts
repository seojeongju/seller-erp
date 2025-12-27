import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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

// 서버 사이드 API 호출 (session을 파라미터로 받음)
export async function apiServer<T>(
  endpoint: string,
  tenantSlug: string = "",
  options: RequestInit = {}
): Promise<T> {
  try {
    // 서버 사이드에서는 상대 경로(/api)를 사용할 수 없으므로 절대 경로로 변환 필요
    const baseUrl = API_URL.startsWith("http")
      ? API_URL
      : process.env.AUTH_URL
        ? `${process.env.AUTH_URL}/api`
        : "http://localhost:3000/api";

    // endpoint가 /api로 시작하면 중복 제거
    const finalEndpoint = endpoint.startsWith("/api") ? endpoint.substring(4) : endpoint;
    const url = API_URL.startsWith("http") ? `${API_URL}${endpoint}` : `${baseUrl}${finalEndpoint}`;

    const response = await fetch(url, {
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

// 클라이언트 사이드 POST/PUT/DELETE 요청
export async function apiClientMutation<T>(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  data?: any
): Promise<T> {
  const session = await getSession();
  const tenantSlug = session?.user?.tenantSlug || "";

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-tenant-slug": tenantSlug,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data || result;
}
