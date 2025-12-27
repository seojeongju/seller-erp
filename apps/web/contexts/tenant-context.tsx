"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TenantContext as TenantContextType, UserRole } from "@seller-erp/types";

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [tenantContext, setTenantContext] = useState<TenantContextType | null>(
    null
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setTenantContext({
        tenantId: session.user.tenantId,
        tenantSlug: session.user.tenantSlug,
        userId: session.user.id,
        userRole: session.user.role as UserRole,
      });
    } else {
      setTenantContext(null);
    }
  }, [session, status]);

  return (
    <TenantContext.Provider value={tenantContext}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === null) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
}

export function useTenantOptional() {
  return useContext(TenantContext);
}

