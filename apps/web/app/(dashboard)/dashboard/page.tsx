import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { apiServer } from "@/lib/api";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { SalesTrend } from "@/components/dashboard/sales-trend";
import { TopProducts } from "@/components/dashboard/top-products";

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/auth/signin");
    }

    // 병렬로 데이터 가져오기 (에러 발생 시 기본값 반환)
    const [kpis, recentOrders, salesTrend, topProducts] = await Promise.all([
      apiServer<any>("/api/dashboard/kpis").catch((err) => {
        console.error("Error fetching KPIs:", err);
        return null;
      }),
      apiServer<any[]>("/api/dashboard/recent-orders?limit=10").catch((err) => {
        console.error("Error fetching recent orders:", err);
        return [];
      }),
      apiServer<any>("/api/dashboard/sales-trend?days=30").catch((err) => {
        console.error("Error fetching sales trend:", err);
        return { dates: [], sales: [] };
      }),
      apiServer<any[]>("/api/dashboard/top-products?limit=5").catch((err) => {
        console.error("Error fetching top products:", err);
        return [];
      }),
    ]);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">ERP 시스템 현황을 한눈에 확인하세요</p>
        </div>

        {/* KPI Cards */}
        {kpis && <KPICards data={kpis} />}

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <div className="lg:col-span-2">
            <SalesTrend data={salesTrend} />
          </div>

          {/* Recent Orders */}
          <div>
            <RecentOrders orders={recentOrders} />
          </div>

          {/* Top Products */}
          <div>
            <TopProducts products={topProducts} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard page error:", error);
    // 에러 발생 시 기본 UI 표시
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">ERP 시스템 현황을 한눈에 확인하세요</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }
}

