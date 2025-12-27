"use client";

import { TrendingUp, TrendingDown, Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface KPIData {
  revenue: {
    monthly: number;
    today: number;
  };
  orders: {
    monthly: number;
    today: number;
    pending: number;
  };
  inventory: {
    lowStock: number;
  };
  customers: {
    total: number;
  };
  products: {
    total: number;
  };
}

interface KPICardsProps {
  data: KPIData;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

export function KPICards({ data }: KPICardsProps) {
  const kpis = [
    {
      title: "이번 달 매출",
      value: formatCurrency(data.revenue.monthly),
      change: data.revenue.today > 0 ? "+" : "",
      changeValue: formatCurrency(data.revenue.today),
      changeLabel: "오늘",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "이번 달 주문",
      value: data.orders.monthly.toLocaleString(),
      change: data.orders.today > 0 ? "+" : "",
      changeValue: data.orders.today.toString(),
      changeLabel: "오늘",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "대기 중인 주문",
      value: data.orders.pending.toLocaleString(),
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "낮은 재고",
      value: data.inventory.lowStock.toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      warning: data.inventory.lowStock > 0,
    },
    {
      title: "총 고객 수",
      value: data.customers.total.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "총 상품 수",
      value: data.products.total.toLocaleString(),
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow ${kpi.warning ? 'border-red-100 ring-1 ring-red-50' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${kpi.bgColor} ${kpi.color}`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            {kpi.change && (
              <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                <span>{kpi.change}</span>
                <span>{kpi.changeValue}</span>
                <span className="text-gray-500 font-normal ml-1">({kpi.changeLabel})</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
