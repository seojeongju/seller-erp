// 공유 TypeScript 타입 정의

// User Role
export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

// Order Status
export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

// Inventory Status
export enum InventoryStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  DAMAGED = "DAMAGED",
  RETURNED = "RETURNED",
}

// API Response 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination 타입
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 테넌트 컨텍스트
export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  userId?: string;
  userRole?: UserRole;
}

