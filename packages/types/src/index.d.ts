export declare enum UserRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare enum InventoryStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    SOLD = "SOLD",
    DAMAGED = "DAMAGED",
    RETURNED = "RETURNED"
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
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
export interface TenantContext {
    tenantId: string;
    tenantSlug: string;
    userId?: string;
    userRole?: UserRole;
}
