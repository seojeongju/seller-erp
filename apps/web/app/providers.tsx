"use client";

import { SessionProvider } from "next-auth/react";
import { TenantProvider } from "@/contexts/tenant-context";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 랜딩 페이지는 Providers 없이 렌더링 (인증 불필요)
  // pathname이 undefined일 수 있으므로 안전하게 처리
  if (!pathname || pathname === "/") {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <TenantProvider>{children}</TenantProvider>
    </SessionProvider>
  );
}

