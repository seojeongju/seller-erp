import { UserRole } from "@seller-erp/types";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      tenantId: string;
      tenantSlug: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    tenantId: string;
    tenantSlug: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    tenantId: string;
    tenantSlug: string;
  }
}

