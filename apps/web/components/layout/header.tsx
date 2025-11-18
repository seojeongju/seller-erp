"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Breadcrumb or Page Title */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {session?.user?.tenantSlug}
          </h2>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{session?.user?.name || session?.user?.email}</p>
              <p className="text-xs text-gray-500">
                {session?.user?.role === "ADMIN" ? "관리자" : "멤버"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  );
}

