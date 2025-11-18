"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Box,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "상품 관리",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "주문 관리",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "고객 관리",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "재고 관리",
    href: "/dashboard/inventory",
    icon: Box,
  },
  {
    title: "설정",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href={tenant ? `/dashboard?tenant=${tenant}` : "/dashboard"} className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="WOW Seller ERP"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-bold text-gray-900">WOW Seller ERP</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const href = tenant ? `${item.href}?tenant=${tenant}` : item.href;

          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

